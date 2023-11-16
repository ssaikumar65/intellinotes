"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import NoteDialog from "./NoteDialog";
import { Button } from "./ui/button";

const AddNoteButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className=" flex items-center gap-2"
      >
        <Plus />
        <span className=" hidden md:flex">Add Note</span>
      </Button>
      <NoteDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
export default AddNoteButton;
