"use client";
import React, { useEffect } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { db } from "../../../utils/dbConfig.jsx";
import { Budgets } from "../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const checkUserBudget = async () => {
    const result = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));

    if (result.length == 0) {
      router.replace("/dashboard/budgets");
    }
  };

  useEffect(() => {
    user && checkUserBudget();
  }, [user]);
  return (
    <div>
      <div className="fixed md:w-64 hidden md:block border shadow-sm">
        <SideNav />
      </div>
      <div className="ml-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
