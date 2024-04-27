import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Expense, Prisma } from '@prisma/client';
import { ExpenseService } from './expense.service';

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  getAllExpenses(): Promise<Expense[]> {
    return this.expenseService.getAllExpenses();
  }

  @Get(':expenseId')
  getExpenseById(@Param('expenseId') expenseId: string): Promise<Expense> {
    return this.expenseService.getExpenseById(parseInt(expenseId));
  }

  @Post()
  createExpense(@Body() createExpenseDto: Prisma.ExpenseCreateInput): Promise<Expense> {
    return this.expenseService.createExpense(createExpenseDto);
  }

  @Patch(':expenseId')
  updateExpense(
    @Param('expenseId') expenseId: string,
    @Body() updateExpenseDto: Prisma.ExpenseUpdateInput,
  ): Promise<Expense> {
    return this.expenseService.updateExpense(parseInt(expenseId), updateExpenseDto);
  }

  @Delete(':expenseId')
  deleteExpense(@Param('expenseId') expenseId: string): Promise<Expense> {
    return this.expenseService.deleteExpense(parseInt(expenseId));
  }
}
