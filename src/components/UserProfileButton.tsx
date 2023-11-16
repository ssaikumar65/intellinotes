"use client";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
const UserProfileButton = () => {
  const { theme } = useTheme();

  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
      }}
    />
  );
};
export default UserProfileButton;
