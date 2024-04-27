import { INestApplication } from '@nestjs/common';
import { Expense, Prisma } from '@prisma/client';
import * as request from 'supertest';

export class ExpenseReq {
  private req: request.Agent;

  constructor(app: INestApplication) {
    this.req = request(app.getHttpServer());
  }

  getAllExpenses() {
    return this.req.get('/expense');
  }

  getExpenseById(expenseId: number) {
    return this.req.get(`/expense/${expenseId}`);
  }

  createExpense(expenseCreateDto: Prisma.ExpenseCreateInput) {
    return this.req.post('/expense').send(expenseCreateDto);
  }

  updateExpense(expenseId: number, expenseUpdateDto: Prisma.ExpenseUpdateInput) {
    return this.req.patch(`/expense/${expenseId}`).send(expenseUpdateDto);
  }

  deleteExpense(expenseId: number) {
    return this.req.delete(`/expense/${expenseId}`);
  }
}

export function expenseShape(expense?: Partial<Expense>) {
  return expect.objectContaining({
    id: expense.id ?? expect.any(Number),
    name: expense.name ?? expect.any(String),
    amount: expense.amount ?? expect.any(String),
    dueDate: expense.dueDate ?? expect.any(String),
    isAllocated: expense.isAllocated ?? expect.any(Boolean),
    isPaid: expense.isPaid ?? expect.any(Boolean),
  });
}
