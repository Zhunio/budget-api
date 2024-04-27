export interface ExpenseCreateDto {
  name: string;
  amount: string;
  dueDate: string;
  isAllocated: boolean;
  isPaid: boolean;
}

export interface ExpenseUpdateDto {
  name: string;
  amount: string;
  dueDate: string;
  isAllocated: boolean;
  isPaid: boolean;
}

export enum ExpenseError {
  CouldNotGetExpenseById = 'Could not retrieved expense. Expense not found.',
  CouldNotUpdateExpense = 'Could not update expense. Expense not found.',
  CouldNotDeleteExpense = 'Could not delete expense because expense does not exists.',
}
