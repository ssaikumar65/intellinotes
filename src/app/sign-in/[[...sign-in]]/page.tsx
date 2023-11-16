import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IntelliNotes - SignIn",
};
const SignInPage = () => {
  return (
    <div className=" grid h-full place-items-center">
      <SignIn />
    </div>
  );
};
export default SignInPage;
