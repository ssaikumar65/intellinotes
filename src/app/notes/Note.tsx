"use client";
import NoteDialog from "@/components/NoteDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Note as NoteModel } from "@prisma/client";
import { useState } from "react";

type Props = {
  note: NoteModel;
};

const Note = ({ note }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const timestamp = (
    note.updatedAt > note.createdAt ? note.updatedAt : note.createdAt
  ).toDateString();
  return (
    <>
      <Card
        onClick={() => setIsOpen(true)}
        className="transition-shadow hover:cursor-pointer hover:shadow-lg"
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>{timestamp}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className=" whitespace-pre-line break-words">{note.content}</p>
        </CardContent>
      </Card>
      <NoteDialog note={note} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
export default Note;
