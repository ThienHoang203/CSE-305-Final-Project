import React, { useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { db } from "../../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../../utils/schema";
import { toast } from "sonner";
import moment from "moment";
function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const addNewExpense = async () => {
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        createdAt: moment().format("DD/MM/yyy"),
      })
      .returning({ insertedId: Budgets.id });

    console.log(result);

    if (result) {
      refreshData();
      toast("New Expense Added Successfuly!");
    }
  };
  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-3">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="example: Home Decor"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-3">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="example:1000$"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount)}
        className={"mt-3 w-full"}
        onClick={() => addNewExpense()}
      >
        Add New Expense
      </Button>
    </div>
  );
}

export default AddExpense;
