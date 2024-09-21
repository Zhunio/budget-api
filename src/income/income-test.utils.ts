import { INestApplication } from '@nestjs/common';
import { Income, Prisma } from '@prisma/client';
import * as request from 'supertest';

export class IncomeReq {
  private req: request.Agent;

  constructor(app: INestApplication) {
    this.req = request(app.getHttpServer());
  }

  getAllIncomes() {
    return this.req.get('/income');
  }

  getIncomeById(incomeId: number) {
    return this.req.get(`/income/${incomeId}`);
  }

  createIncome(incomeCreateDto: Prisma.IncomeCreateInput) {
    return this.req.post('/income').send(incomeCreateDto);
  }

  updateIncome(incomeId: number, incomeUpdateDto: Prisma.IncomeUpdateInput) {
    return this.req.patch(`/income/${incomeId}`).send(incomeUpdateDto);
  }

  deleteIncome(incomeId: number) {
    return this.req.delete(`/income/${incomeId}`);
  }
}

export function incomeShape(income?: Partial<Income>) {
  return expect.objectContaining({
    id: income.id ?? expect.any(Number),
    name: income.name ?? expect.any(String),
    receivedDate: income.receivedDate ?? expect.any(String),
    amount: income.amount ?? expect.any(String),
    initialBalance: income.initialBalance ?? expect.any(String),
  });
}
