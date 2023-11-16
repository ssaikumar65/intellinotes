import "@/app/globals.css";
import type { Metadata } from "next";
import Header from "./Header";

export const metadata: Metadata = {
  title: "IntelliNotes - Notes",
};
export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Header />
      {children}
    </div>
  );
}
