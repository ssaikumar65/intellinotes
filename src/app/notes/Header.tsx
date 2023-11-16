import AIChatButton from "@/components/AIChatButton";
import AddNoteButton from "@/components/AddNoteButton";
import ThemeButton from "@/components/ThemeButton";
import UserProfileButton from "@/components/UserProfileButton";
import Image from "next/image";
import Link from "next/link";
import logo from "../../assets/logo.png";

const Header = () => {
  return (
    <div className=" sticky top-0 z-50 flex h-20 w-full items-center justify-between overflow-hidden border-b border-white/20 bg-transparent px-4 shadow-lg shadow-black/10 saturate-200 backdrop-blur md:px-16 lg:px-20">
      <Link href="/notes" className="flex items-center gap-2 md:gap-4">
        <Image
          width={40}
          height={40}
          priority
          referrerPolicy="no-referrer"
          alt="logo"
          src={logo}
        />
        <span className="text-lg font-extrabold md:text-xl">IntelliNotes</span>
      </Link>
      <div className="flex gap-2 md:gap-4">
        <UserProfileButton />
        <ThemeButton />
        <AddNoteButton />
        <AIChatButton />
      </div>
    </div>
  );
};
export default Header;
