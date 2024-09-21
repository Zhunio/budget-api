import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Income, Prisma } from '@prisma/client';
import { IncomeService } from './income.service';

@Controller('income')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Get()
  getAllIncomes(): Promise<Income[]> {
    return this.incomeService.getAllIncomes();
  }

  @Get(':incomeId')
  getIncomeById(@Param('incomeId') incomeId: string): Promise<Income> {
    return this.incomeService.getIncomeById(parseInt(incomeId));
  }

  @Post()
  createIncome(@Body() createIncomeDto: Prisma.IncomeCreateInput): Promise<Income> {
    return this.incomeService.createIncome(createIncomeDto);
  }

  @Patch(':incomeId')
  updateIncome(
    @Param('incomeId') incomeId: string,
    @Body() updateIncomeDto: Prisma.IncomeUpdateInput,
  ): Promise<Income> {
    return this.incomeService.updateIncome(parseInt(incomeId), updateIncomeDto);
  }

  @Delete(':incomeId')
  deleteIncome(@Param('incomeId') incomeId: string): Promise<Income> {
    return this.incomeService.deleteIncome(parseInt(incomeId));
  }
}
