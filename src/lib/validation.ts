import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional(),
});

export const updateNoteSchema = createNoteSchema.extend({
  id: z.string().min(1),
});

export const deleteNoteSchema = z.object({
  id: z.string().min(1),
});

export type TCreateNote = z.infer<typeof createNoteSchema>;
export type TEditNote = z.infer<typeof updateNoteSchema>;
export type TDeleteNote = z.infer<typeof deleteNoteSchema>;
