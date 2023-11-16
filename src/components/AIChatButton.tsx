"use client";
import { Bot } from "lucide-react";
import { useState } from "react";
import AIChat from "./AIChat";
import { Button } from "./ui/button";

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className=" flex items-center gap-2"
      >
        <Bot />
        <span className=" hidden md:flex">AI Chat</span>
      </Button>
      <AIChat isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
export default AIChatButton;
