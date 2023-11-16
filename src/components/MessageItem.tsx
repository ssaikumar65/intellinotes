import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Message } from "ai";
import { Bot } from "lucide-react";
import Image from "next/image";

const MessageItem = ({
  message,
}: {
  message: Pick<Message, "role" | "content">;
}) => {
  const { user } = useUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const isAIMessage = message.role === "assistant";

  return (
    <li
      className={cn(
        "flex w-full items-center gap-1",
        !isAIMessage && "flex-row-reverse justify-start",
      )}
    >
      {isAIMessage ? (
        <Bot className=" h-7 w-7 overflow-hidden rounded-full border-2 border-foreground p-1" />
      ) : (
        <Image
          src={user.imageUrl}
          alt="image"
          width={28}
          height={28}
          className=" h-7 w-7 rounded-full object-cover"
        />
      )}

      <div
        className={cn(
          "flex w-fit min-w-[80px] max-w-xs items-center overflow-hidden rounded-lg p-2 shadow-md",
          isAIMessage
            ? "bg-background text-foreground"
            : "bg-foreground text-background",
        )}
      >
        <p className="whitespace-pre-line break-words">{message.content}</p>
      </div>
    </li>
  );
};
export default MessageItem;
