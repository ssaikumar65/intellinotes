import prisma from "@/lib/db";
import { getEmbeddings } from "@/lib/openai";
import { notesIndex } from "@/lib/pinecone";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs";

const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const parsedResult = createNoteSchema.safeParse(body);

    if (!parsedResult.success) {
      console.log(parsedResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { title, content } = parsedResult.data;

    const embeddings = await getNoteEmbeddings(title, content);

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: { title, content, userId },
      });
      await notesIndex.upsert([
        {
          id: note.id,
          values: embeddings,
          metadata: { userId },
        },
      ]);
      return note;
    });
    return Response.json({ note }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

const PUT = async (req: Request) => {
  try {
    const { userId } = auth();

    const body = await req.json();
    const parsedResult = updateNoteSchema.safeParse(body);

    if (!parsedResult.success) {
      console.log(parsedResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { title, content, id } = parsedResult.data;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    if (!userId || note.userId !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embeddings = await getNoteEmbeddings(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });
      await notesIndex.upsert([
        {
          id,
          values: embeddings,
          metadata: { userId },
        },
      ]);
      return updatedNote;
    });

    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

const DELETE = async (req: Request) => {
  try {
    const { userId } = auth();

    const body = await req.json();
    const parsedResult = deleteNoteSchema.safeParse(body);

    if (!parsedResult.success) {
      console.log(parsedResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { id } = parsedResult.data;

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    if (!userId || note.userId !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({
        where: { id },
      });
      await notesIndex.deleteOne(id);
    });

    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

const getNoteEmbeddings = (title: string, content?: string) =>
  getEmbeddings(title + "\n\n" + content ?? "");

export { POST, PUT, DELETE };
