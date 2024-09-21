import { INestApplication } from '@nestjs/common';
import { Budget, Prisma } from '@prisma/client';
import * as request from 'supertest';

export class BudgetReq {
  private req: request.Agent;

  constructor(app: INestApplication) {
    this.req = request(app.getHttpServer());
  }

  getAllBudgets() {
    return this.req.get('/budget');
  }

  getBudgetById(budgetId: number) {
    return this.req.get(`/budget/${budgetId}`);
  }

  createBudget(budgetCreateDto: Prisma.BudgetCreateInput) {
    return this.req.post('/budget').send(budgetCreateDto);
  }

  updateBudget(budgetId: number, budgetUpdateDto: Prisma.BudgetUpdateInput) {
    return this.req.patch(`/budget/${budgetId}`).send(budgetUpdateDto);
  }

  deleteBudget(budgetId: number) {
    return this.req.delete(`/budget/${budgetId}`);
  }
}

export function budgetShape(budget?: Partial<Budget>) {
  return expect.objectContaining({
    id: budget.id ?? expect.any(Number),
    name: budget.name ?? expect.any(String),
    month: budget.month ?? expect.any(String),
    year: budget.year ?? expect.any(String),
  });
}
