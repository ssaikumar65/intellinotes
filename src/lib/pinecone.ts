import { Pinecone } from "@pinecone-database/pinecone";
const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) {
  throw new Error("Pinecone key is required");
}
const pinecone = new Pinecone({ apiKey, environment: "gcp-starter" });

export default pinecone;
export const notesIndex = pinecone.Index("intellinotes");
