import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Budget, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BudgetError } from './budget.model';

@Injectable()
export class BudgetService {
  constructor(private prismaService: PrismaService) {}

  async getAllBudgets(): Promise<Budget[]> {
    const budgets = await this.prismaService.budget.findMany({ include: { expenses: true } });
    return budgets;
  }

  async getBudgetById(budgetId: number): Promise<Budget> {
    const budget = await this.prismaService.budget.findFirst({ where: { id: budgetId }, include: { expenses: true } });
    if (!budget) {
      throw new HttpException(BudgetError.CouldNotGetBudgetById, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return budget;
  }

  async createBudget(budget: Prisma.BudgetCreateInput): Promise<Budget> {
    const budgetCreated = await this.prismaService.budget.create({ data: budget });
    return budgetCreated;
  }

  async updateBudget(budgetId: number, budgetUpdateDto: Prisma.BudgetUpdateInput): Promise<Budget> {
    const budget = await this.prismaService.budget.findFirst({ where: { id: budgetId } });
    if (!budget) {
      throw new HttpException(BudgetError.CouldNotUpdateBudget, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const budgetUpdated = await this.prismaService.budget.update({
      where: { id: budgetId },
      data: budgetUpdateDto,
    });
    return budgetUpdated;
  }

  async deleteBudget(budgetId: number): Promise<Budget> {
    const budget = await this.prismaService.budget.findFirst({ where: { id: budgetId } });
    if (!budget) {
      throw new HttpException(BudgetError.CouldNotDeleteBudget, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const budgetDeleted = await this.prismaService.budget.delete({ where: { id: budgetId } });
    return budgetDeleted;
  }
}
