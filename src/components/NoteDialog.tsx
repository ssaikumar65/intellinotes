import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { TCreateNote, createNoteSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Note } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  note?: Note;
};
const NoteDialog = ({ isOpen, setIsOpen, note }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<TCreateNote>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
    },
  });
  async function onSubmit(values: TCreateNote) {
    try {
      if (note) {
        const res = await fetch("/api/notes", {
          method: "put",
          body: JSON.stringify({ id: note.id, ...values }),
        });
        if (!res.ok) {
          throw new Error("Status code: " + res.status);
        }
      } else {
        const res = await fetch("/api/notes", {
          method: "post",
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          throw new Error("Status code: " + res.status);
        }
        form.reset();
      }

      router.refresh();
      toast({ description: note ? "Note updated." : "Note created." });
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "Something went wrong" });
    }
  }
  async function onDelete() {
    setIsLoading(true);
    try {
      if (!note) {
        return;
      }
      const res = await fetch("/api/notes", {
        method: "delete",
        body: JSON.stringify({ id: note.id }),
      });
      if (!res.ok) {
        throw new Error("Status code: " + res.status);
      }
      router.refresh();
      toast({ description: "Note deleted" });
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", description: "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogTitle>{note ? "Edit note" : "Add a note"}</DialogTitle>
        <DialogDescription asChild>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter the content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  className="w-32"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className=" animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
                {note ? (
                  <Button
                    variant="destructive"
                    className="w-32"
                    onClick={onDelete}
                    disabled={isLoading}
                    type="button"
                  >
                    {isLoading ? (
                      <Loader2 className=" animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                ) : null}
              </DialogFooter>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
export default NoteDialog;
