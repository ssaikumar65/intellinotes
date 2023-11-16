import { OpenAI } from "openai";
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("Openai key is required");
}
const openai = new OpenAI({ apiKey });

export const getEmbeddings = async (text: string) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  const embeddings = response.data[0].embedding;
  if (!embeddings) throw new Error("Embeddings not generated");
  return embeddings;
};

export default openai;
