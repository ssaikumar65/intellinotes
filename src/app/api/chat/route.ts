import prisma from "@/lib/db";
import openai, { getEmbeddings } from "@/lib/openai";
import { notesIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages.slice(-6);

    const embeddings = await getEmbeddings(
      messages.map((message) => message.content).join("\n"),
    );

    const vectorResponse = await notesIndex.query({
      topK: 4,
      vector: embeddings,
      filter: { userId },
    });

    const notes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorResponse.matches.map((match) => match.id),
        },
      },
    });

    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content:
        "You are an intelligent note taking app. You answer the user's questions based on their existing notes." +
        "The relevant notes for this query are: \n" +
        notes
          .map((note) => `Title:${note.title}\n\nContent:${note.content}\n`)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messages],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
