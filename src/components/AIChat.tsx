import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChat } from "ai/react";
import { Trash } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
export default function AIChat({ isOpen, setIsOpen }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLUListElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const isUserLastMessage =
    messages &&
    messages.length > 0 &&
    messages[messages.length - 1].role === "user";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogTitle className=" text-center text-2xl font-bold">
          AI Chat
        </DialogTitle>
        <DialogDescription>
          <ul
            ref={scrollRef}
            className=" flex h-96 w-full flex-col gap-5 overflow-hidden overflow-y-scroll rounded-lg bg-foreground/5 p-3 transition-all"
          >
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))
            ) : (
              <span className=" grid h-full w-full place-items-center">
                Ask AI anything from IntelliNotes
              </span>
            )}
            {isLoading && isUserLastMessage ? (
              <MessageItem
                message={{ role: "assistant", content: "Thinking..." }}
              />
            ) : null}
            {error ? (
              <MessageItem
                message={{
                  role: "assistant",
                  content: "Something went wrong.",
                }}
              />
            ) : null}
          </ul>
        </DialogDescription>
        <form
          className=" flex gap-2 rounded-lg bg-foreground/5 p-2"
          onSubmit={handleSubmit}
        >
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something..."
          />
          <Button type="submit">Send</Button>
          <Button
            size={"icon"}
            title="Clear"
            onClick={() => setMessages([])}
            variant={"outline"}
            type="button"
            className=" shrink-0"
          >
            <Trash />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
