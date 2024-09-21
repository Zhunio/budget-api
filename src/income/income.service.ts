import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IncomeError } from './income.model';

@Injectable()
export class IncomeService {
  constructor(private prismaService: PrismaService) {}

  async getAllIncomes() {
    const incomes = await this.prismaService.income.findMany({ include: { expenses: true } });
    return incomes;
  }

  async getIncomeById(incomeId: number) {
    const income = await this.prismaService.income.findFirst({ where: { id: incomeId }, include: { expenses: true } });

    if (!income) {
      throw new HttpException(IncomeError.CouldNotGetIncomeById, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return income;
  }

  async createIncome(income: Prisma.IncomeCreateInput) {
    const incomeCreated = await this.prismaService.income.create({ data: income });
    return incomeCreated;
  }

  async updateIncome(incomeId: number, incomeUpdateDto: Prisma.IncomeUpdateInput) {
    const income = await this.prismaService.income.findFirst({ where: { id: incomeId } });
    if (!income) {
      throw new HttpException(IncomeError.CouldNotUpdateIncome, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const incomeUpdated = await this.prismaService.income.update({ where: { id: incomeId }, data: incomeUpdateDto });

    return incomeUpdated;
  }

  async deleteIncome(incomeId: number) {
    const income = await this.prismaService.income.findFirst({ where: { id: incomeId } });
    if (!income) {
      throw new HttpException(IncomeError.CouldNotDeleteIncome, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const incomeDeleted = await this.prismaService.income.delete({ where: { id: incomeId } });
    return incomeDeleted;
  }
}
