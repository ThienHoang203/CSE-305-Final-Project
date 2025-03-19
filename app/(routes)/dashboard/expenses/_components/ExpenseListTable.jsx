import { Trash } from "lucide-react";
import React from "react";
import { db } from "../../../../../utils/dbConfig";
import { Expenses } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function ExpenseListTable({ expensesList, refreshData }) {
  const deleteExpense = async (expense) => {
    const result = await db
      .delete(Expenses)
      .where(eq(Expenses.id, expense.id))
      .returning();

    if (result) {
      toast("Expense Deleted Successfuly !");
      refreshData();
    }
  };
  return (
    <div className="mt-3">
      <div className="grid grid-cols-4 bg-slate-200 p-3  font-bold">
        <h2>Name</h2>
        <h2>Amount</h2>
        <h2>Date</h2>
        <h2>Action</h2>
      </div>
      {expensesList.length > 0 ? (
        expensesList.map((expense, index) => (
          <div className="grid grid-cols-4 p-2" key={index}>
            <h2>{expense.name}</h2>
            <h2>{expense.amount}</h2>
            <h2>{expense.createdAt}</h2>
            <h2>
              <Trash
                className="text-red-600 cursor-pointer"
                onClick={() => deleteExpense(expense)}
              />
            </h2>
          </div>
        ))
      ) : (
        <div className="text-center mt-3 font-semibold text-lg">
          No Expense Available
        </div>
      )}
    </div>
  );
}

export default ExpenseListTable;
