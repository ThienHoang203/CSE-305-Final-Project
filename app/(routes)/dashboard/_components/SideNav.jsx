"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 3,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/list",
    },
    // {
    //   id: 4,
    //   name: "Upgrade",
    //   icon: ShieldCheck,
    //   path: "/dashboard/upgrade",
    // },
  ];

  const path = usePathname();

  return (
    <div className="h-screen p-5">
      <Image
        src={"https://img.logoipsum.com/363.svg"}
        alt="logo"
        width={60}
        height={100}
      />
      <div className="mt-5">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <h2
              className={`flex gap-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100 ${
                path == menu.path && "text-primary bg-blue-100"
              }`}
            >
              {<menu.icon />}
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>

      <div className="fixed bottom-10 flex flex-col font-bold gap-2 items-center p-5">
        <UserButton />
        <p>Profile</p>
      </div>
    </div>
  );
}

export default SideNav;
