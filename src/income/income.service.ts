import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IncomeService {
  constructor(private prismaService: PrismaService) {}

  async getIncomes() {
    const incomes = await this.prismaService.income.findMany();
    return incomes;
  }

  async getIncomeById(incomeId: number) {
    const income = await this.prismaService.income.findFirst({ where: { id: incomeId } });

    if (!income) {
      throw new HttpException('Income not found', HttpStatus.NOT_FOUND);
    }

    return income;
  }

  async createIncome(income: Prisma.IncomeCreateInput) {
    const incomeCreated = await this.prismaService.income.create({ data: income });
    return incomeCreated;
  }

  async updateIncome(incomeId: number, income: Prisma.IncomeUpdateInput) {
    const incomeUpdated = await this.prismaService.income.update({ where: { id: incomeId }, data: income });
    return incomeUpdated;
  }

  async deleteIncome(incomeId: number) {
    const incomeDeleted = await this.prismaService.income.delete({ where: { id: incomeId } });
    return incomeDeleted;
  }
}
