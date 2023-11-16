import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import logo from "../assets/logo.png";

export default function Home() {
  const { userId } = auth();
  if (userId) redirect("/notes");
  return (
    <div className=" flex min-h-screen flex-col items-center justify-center gap-12">
      <div className="flex items-center gap-4">
        <Image
          width={40}
          height={40}
          priority
          referrerPolicy="no-referrer"
          alt="logo"
          src={logo}
        />
        <span className="text-4xl font-extrabold">IntelliNotes</span>
      </div>
      <Link href="/notes">
        <Button>Open</Button>
      </Link>
    </div>
  );
}
