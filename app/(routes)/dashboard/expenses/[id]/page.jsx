"use client";
import React, { useEffect, useState } from "react";
import { db } from "../../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../../utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "../../../../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";
import { toast } from "sonner";
import { PenBox, Trash } from "lucide-react";
import EditBudget from "../_components/EditBudget";

function ExpensesScreen() {
  const paramsPromise = useParams();
  const { user } = useUser();
  const [params, setParams] = useState(null);
  const [budgetInfo, setBudgetInfo] = useState({});
  const [expenseList, setExpenseList] = useState([]);
  const route = useRouter();

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await paramsPromise;
      setParams(resolvedParams);
    }
    fetchParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (user && params?.id) {
      getBudgetInfo(params.id);
    }
  }, [user, params]);

  const getBudgetInfo = async (budgetId) => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(
        sql`${Budgets.createdBy} = ${user.primaryEmailAddress.emailAddress} 
            AND ${Budgets.id} = ${budgetId}`
      )
      .groupBy(Budgets.id);
    setBudgetInfo(result[0]);
    getExpenseList();
  };

  if (!params) return <div>Loading...</div>;

  const getExpenseList = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));
    setExpenseList(result);
  };

  const deleteBudget = async () => {
    const deleteExpenseRes = await db
      .delete(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .returning();
    if (deleteExpenseRes) {
      const result = await db
        .delete(Budgets)
        .where(eq(Budgets.id, params.id))
        .returning();
      toast("Budget Deleted!");
      route.replace("/dashboard/budgets");
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-5 flex justify-between">
        My Expenses
        <div className="flex gap-3">
          <EditBudget
            budgetInfo={budgetInfo}
            refreshData={() => getBudgetInfo(params.id)}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className={"flex gap-2"} variant={"destructive"}>
                <Trash />
                Delete This Budget
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget along with expenses and remove your data
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className=" w-full h-[150px] bg-slate-200 rounded-lg animate-pulse "></div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={() => getBudgetInfo(params.id)}
        />
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-lg">Latest Expenses</h2>
        <ExpenseListTable
          expensesList={expenseList}
          refreshData={() => getBudgetInfo(params.id)}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
