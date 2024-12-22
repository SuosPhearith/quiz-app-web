import React from "react";
import { Metadata } from "next";
import Signin from "@/components/Auth/Signin";
import SigninWithPassword from "@/components/Auth/SigninWithPassword";

export const metadata: Metadata = {
  title: "Quiz System | login",
  description: "login",
};

const SignIn: React.FC = () => {
  return (
    // <div>
    //   <div className="h-screen rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
    //     <div className="flex items-center justify-center">
    //       <div className="w-full xl:w-1/2">
    //         <div className="w-full p-4 sm:p-12.5 xl:p-15">
    //           <Signin />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <main>
      <SigninWithPassword />
    </main>
  );
};

export default SignIn;
