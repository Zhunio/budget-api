import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { ExpenseReq } from '../expense/expense-test.utils';
import { ExpenseModule } from '../expense/expense.module';
import { PrismaService } from '../prisma/prisma.service';
import { IncomeReq, incomeShape } from './income-test.utils';
import { IncomeError } from './income.model';
import { IncomeModule } from './income.module';

describe('IncomeController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let incomeReq: IncomeReq;
  let expenseReq: ExpenseReq;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [IncomeModule, ExpenseModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = module.get(PrismaService);
    incomeReq = new IncomeReq(app);
    expenseReq = new ExpenseReq(app);

    await app.init();
    await prismaService.cleanDatabase();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getAllIncomes()', () => {
    it('should get all incomes', async () => {
      const incomeCreateDto: Prisma.IncomeCreateInput = {
        name: '01/05/2024',
        receivedDate: '01/05/2024',
        initialBalance: '0.00',
        amount: '2500.00',
      };
      await incomeReq.createIncome(incomeCreateDto);
      const { body: incomes } = await incomeReq.getAllIncomes();
      expect(incomes).toEqual(expect.arrayContaining([incomeShape(incomeCreateDto)]));
    });
  });

  describe('getIncomeById()', () => {
    it('should get income by id', async () => {
      const incomeCreateDto: Prisma.IncomeCreateInput = {
        name: '01/05/2024',
        receivedDate: '01/05/2024',
        initialBalance: '0.00',
        amount: '2500.00',
      };
      const {
        body: { id },
      } = await incomeReq.createIncome(incomeCreateDto);
      const { body: incomeCreated } = await incomeReq.getIncomeById(id);
      expect(incomeCreated).toEqual(incomeShape(incomeCreated));
    });

    it('should throw an error when trying to retrieve income that does not exists', async () => {
      const incomeId = -1;
      const { body, status } = await incomeReq.getIncomeById(incomeId);
      expect(body.message).toEqual(IncomeError.CouldNotGetIncomeById);
      expect(status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('createIncome()', () => {
    it('should create income', async () => {
      const incomeCreateDto: Prisma.IncomeCreateInput = {
        name: '01/05/2024',
        receivedDate: '01/05/2024',
        initialBalance: '0.00',
        amount: '2500.00',
      };
      const {
        body: { id },
      } = await incomeReq.createIncome(incomeCreateDto);
      const { body: income } = await incomeReq.getIncomeById(id);
      expect(income).toEqual(incomeShape(incomeCreateDto));
    });
  });

  describe('updateIncome()', () => {
    it('should update income', async () => {
      const incomeCreateDto: Prisma.IncomeCreateInput = {
        name: '01/05/2024',
        receivedDate: '01/05/2024',
        initialBalance: '0.00',
        amount: '2500.00',
      };

      const {
        body: { id },
      } = await incomeReq.createIncome(incomeCreateDto);

      await incomeReq.updateIncome(id, { name: '01/10/2024' });
      await incomeReq.updateIncome(id, { receivedDate: '01/10/2024' });
      await incomeReq.updateIncome(id, { initialBalance: '10.00' });
      await incomeReq.updateIncome(id, { amount: '3000.00' });

      const { body: income } = await incomeReq.getIncomeById(id);
      expect(income).toEqual(
        incomeShape({
          name: '01/10/2024',
          receivedDate: '01/10/2024',
          initialBalance: '10.00',
          amount: '3000.00',
        }),
      );
    });

    it('should throw an error when trying to update income that does not exists', async () => {
      const incomeId = -1;
      const { body, statusCode } = await incomeReq.updateIncome(incomeId, {});
      expect(body.message).toEqual(IncomeError.CouldNotUpdateIncome);
      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('addExpenseToIncome()', () => {
    it('should add expense to income', async () => {
      const incomeCreateDto: Prisma.IncomeCreateInput = {
        name: '01/05/2024',
        receivedDate: '01/05/2024',
        initialBalance: '0.00',
        amount: '2500.00',
      };

      const {
        body: { id },
      } = await incomeReq.createIncome(incomeCreateDto);

      const expenseCreateDto: Prisma.ExpenseCreateInput = {
        name: 'Rent',
        amount: '1500.00',
        dueDate: '01/01/2024',
        isAllocated: false,
        isPaid: false,
        income: {
          connect: { id },
        },
      };
      await expenseReq.createExpense(expenseCreateDto);

      const { body: budget } = await incomeReq.getIncomeById(id);
      expect(budget.expenses).toHaveLength(1);
    });
  });

  describe('removeExpenseFromIncome()', () => {
    it('should remove expense from budget', async () => {
      const incomeCreteDto: Prisma.IncomeCreateInput = {
        name: '01/05/2024',
        receivedDate: '01/05/2024',
        initialBalance: '0.00',
        amount: '2500.00',
      };

      const {
        body: { id },
      } = await incomeReq.createIncome(incomeCreteDto);

      const expenseCreateDto: Prisma.ExpenseCreateInput = {
        name: 'Rent',
        amount: '1500.00',
        dueDate: '01/01/2024',
        isAllocated: false,
        isPaid: false,
        income: {
          connect: { id },
        },
      };
      const {
        body: { id: expenseId },
      } = await expenseReq.createExpense(expenseCreateDto);
      await expenseReq.deleteExpense(expenseId);

      const { body: income } = await incomeReq.getIncomeById(id);
      expect(income.expenses).toHaveLength(0);
    });
  });

  describe('deleteIncome()', () => {
    it('should delete income', async () => {
      const incomeCreateDto: Prisma.IncomeCreateInput = {
        name: '01/05/2024',
        receivedDate: '01/05/2024',
        initialBalance: '0.00',
        amount: '2500.00',
      };

      const {
        body: { id },
      } = await incomeReq.createIncome(incomeCreateDto);
      const { body, statusCode } = await incomeReq.deleteIncome(id);

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(body).toEqual(incomeShape(incomeCreateDto));
    });

    it('should throw an error when trying to delete income that does not exists', async () => {
      const incomeId = -1;
      const { body, statusCode } = await incomeReq.deleteIncome(incomeId);
      expect(body.message).toEqual(IncomeError.CouldNotDeleteIncome);
      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
