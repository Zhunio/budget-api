import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Expense, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ExpenseError } from './expense.model';

@Injectable()
export class ExpenseService {
  constructor(private prismaService: PrismaService) {}

  async getAllExpenses(): Promise<Expense[]> {
    const expenses = await this.prismaService.expense.findMany();
    return expenses;
  }

  async getExpenseById(expenseId: number): Promise<Expense> {
    const expense = await this.prismaService.expense.findFirst({ where: { id: expenseId } });
    if (!expense) {
      throw new HttpException(ExpenseError.CouldNotGetExpenseById, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return expense;
  }

  async createExpense(expense: Prisma.ExpenseCreateInput): Promise<Expense> {
    const expenseCreated = await this.prismaService.expense.create({ data: expense });
    return expenseCreated;
  }

  async updateExpense(expenseId: number, expenseUpdateDto: Prisma.ExpenseUpdateInput): Promise<Expense> {
    const expense = await this.prismaService.expense.findFirst({ where: { id: expenseId } });
    if (!expense) {
      throw new HttpException(ExpenseError.CouldNotUpdateExpense, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const expenseUpdated = await this.prismaService.expense.update({
      where: { id: expenseId },
      data: expenseUpdateDto,
    });
    return expenseUpdated;
  }

  async deleteExpense(expenseId: number): Promise<Expense> {
    const expense = await this.prismaService.expense.findFirst({ where: { id: expenseId } });
    if (!expense) {
      throw new HttpException(ExpenseError.CouldNotDeleteExpense, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const expenseDeleted = await this.prismaService.expense.delete({ where: { id: expenseId } });
    return expenseDeleted;
  }
}
