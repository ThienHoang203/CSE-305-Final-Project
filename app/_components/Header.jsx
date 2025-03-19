"use client";
import React from "react";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

function Header() {
  const { user, isSignedIn } = useUser();
  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <Image
        src={"https://img.logoipsum.com/363.svg"}
        alt="logo"
        width={60}
        height={100}
      />
      {isSignedIn ? (
        <UserButton />
      ) : (
        <Link href={"/sign-in"}>
          <button className="w-[100px] h-[40px] bg-black text-white rounded-sm px-2">
            Get Started
          </button>
        </Link>
      )}
    </div>
  );
}

export default Header;
