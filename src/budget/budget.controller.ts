import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Budget, Prisma } from '@prisma/client';
import { BudgetService } from './budget.service';

@Controller('budget')
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Get()
  getAllBudgets(): Promise<Budget[]> {
    return this.budgetService.getAllBudgets();
  }

  @Get(':budgetId')
  getBudgetById(@Param('budgetId') budgetId: string): Promise<Budget> {
    return this.budgetService.getBudgetById(parseInt(budgetId));
  }

  @Post()
  createBudget(@Body() createBudgetDto: Prisma.BudgetCreateInput): Promise<Budget> {
    return this.budgetService.createBudget(createBudgetDto);
  }

  @Patch(':budgetId')
  updateBudget(
    @Param('budgetId') budgetId: string,
    @Body() updateBudgetDto: Prisma.BudgetUpdateInput,
  ): Promise<Budget> {
    return this.budgetService.updateBudget(parseInt(budgetId), updateBudgetDto);
  }

  @Delete(':budgetId')
  deleteBudget(@Param('budgetId') budgetId: string): Promise<Budget> {
    return this.budgetService.deleteBudget(parseInt(budgetId));
  }
}
