import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Note from "./Note";

const Notes = async () => {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const notes = await prisma.note.findMany({ where: { userId } });

  return (
    <main className=" grid gap-3 px-16 py-16 sm:grid-cols-2 lg:grid-cols-3 lg:px-32">
      {notes && notes.length > 0 ? (
        notes
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .map((item: any) => <Note key={item.id} note={item} />)
      ) : (
        <span className=" col-span-full text-center text-xl">
          No notes to display
        </span>
      )}
    </main>
  );
};
export default Notes;
