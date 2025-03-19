"use client";
import React, { useEffect, useState } from "react";
import ExpenseListTable from "../expenses/_components/ExpenseListTable";
import { db } from "../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../../components/ui/button";

function ExpenseList() {
  const { user } = useUser();
  const [list, setList] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getAllExpense();
    console.log(list);
  };

  const getAllExpense = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));

    setList(result);
    console.log(result);
  };

  useEffect(() => {
    user && getBudgetList();
  }, [user]);

  //export to csv func
  const exportToCSV = (data, filename) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map((row) => Object.values(row).join(",")).join("\n");
    const csvString = headers + csvRows;

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Expenses Report</h2>
        <Button
          className={"cursor-pointer hover:bg-green-600"}
          onClick={() => exportToCSV(list, "expenses.csv")}
        >
          Export report as CSV
        </Button>
      </div>

      <ExpenseListTable
        expensesList={list}
        refreshData={() => getBudgetList()}
      />
    </div>
  );
}

export default ExpenseList;
