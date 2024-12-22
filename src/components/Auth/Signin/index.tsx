"use client";
import Link from "next/link";
import React from "react";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      {/* <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center text-2xl font-medium dark:bg-gray-dark">
          Sign in to Quiz System
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div> */}

      <div>
        <SigninWithPassword />
      </div>

      {/* <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/signup" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div> */}
    </>
  );
}
