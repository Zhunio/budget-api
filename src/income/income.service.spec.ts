import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IncomeModule } from './income.module';
import { IncomeService } from './income.service';

export function incomeShape(income?: Partial<Prisma.IncomeCreateInput>) {
  return expect.objectContaining({
    id: expect.any(Number),
    name: income.name ?? expect.any(String),
    receivedDate: income.receivedDate ?? expect.any(String),
    initialBalance: income.initialBalance ?? expect.any(String),
    amount: income.amount ?? expect.any(String),
  });
}

describe('IncomeService', () => {
  let incomeService: IncomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [IncomeModule],
    }).compile();

    incomeService = module.get(IncomeService);
    prismaService = module.get(PrismaService);

    await prismaService.cleanDatabase();
  });

  it('should get incomes', async () => {
    const income: Prisma.IncomeCreateInput = {
      name: '01/05/2024',
      receivedDate: '01/05/2024',
      initialBalance: '0.00',
      amount: '2500.00',
    };

    await incomeService.createIncome(income);
    const incomes = await incomeService.getIncomes();
    expect(incomes).toEqual(expect.arrayContaining([incomeShape(income)]));
  });

  it('should get income by id', async () => {
    const income: Prisma.IncomeCreateInput = {
      name: '01/05/2024',
      receivedDate: '01/05/2024',
      initialBalance: '0.00',
      amount: '2500.00',
    };

    const { id } = await incomeService.createIncome(income);
    const incomeCreated = await incomeService.getIncomeById(id);
    expect(incomeCreated).toEqual(incomeShape(income));
  });

  it('should create income', async () => {
    const income: Prisma.IncomeCreateInput = {
      name: '01/05/2024',
      receivedDate: '01/05/2024',
      initialBalance: '0.00',
      amount: '2500.00',
    };

    const incomeCreated = await incomeService.createIncome(income);
    expect(incomeCreated).toEqual(incomeShape(income));
  });

  it('should update income', async () => {
    const income: Prisma.IncomeCreateInput = {
      name: '01/05/2024',
      receivedDate: '01/05/2024',
      initialBalance: '0.00',
      amount: '2500.00',
    };

    const { id } = await incomeService.createIncome(income);
    const updatedIncome = await incomeService.updateIncome(id, { amount: '2000.00' });
    expect(updatedIncome).toEqual(
      incomeShape({
        ...income,
        amount: '2000.00',
      }),
    );
  });

  it('should delete income', async () => {
    const income: Prisma.IncomeCreateInput = {
      name: '01/05/2024',
      receivedDate: '01/05/2024',
      initialBalance: '0.00',
      amount: '2500.00',
    };
    const { id } = await incomeService.createIncome(income);
    const incomeDeleted = await incomeService.deleteIncome(id);

    expect(incomeDeleted).toEqual(incomeShape(income));
  });
});
