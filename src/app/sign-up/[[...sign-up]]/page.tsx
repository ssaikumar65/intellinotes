import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IntelliNotes - SignUp",
};
const SignUpPage = () => {
  return (
    <div className=" grid h-full place-items-center">
      <SignUp />
    </div>
  );
};
export default SignUpPage;
