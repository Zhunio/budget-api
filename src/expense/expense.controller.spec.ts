import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ExpenseReq, expenseShape } from './expense-test.utils';
import { ExpenseError } from './expense.model';
import { ExpenseModule } from './expense.module';

describe('ExpenseController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let expenseReq: ExpenseReq;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ExpenseModule],
    }).compile();

    app = module.createNestApplication();

    prismaService = module.get(PrismaService);

    expenseReq = new ExpenseReq(app);

    await app.init();
    await prismaService.cleanDatabase();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getAllExpenses()', () => {
    it('should get all expenses', async () => {
      const expenseCreateDto: Prisma.ExpenseCreateInput = {
        name: 'Rent',
        amount: '1500.00',
        dueDate: '01/01/2024',
        isAllocated: false,
        isPaid: false,
      };
      await expenseReq.createExpense(expenseCreateDto);
      const { body: expenses } = await expenseReq.getAllExpenses();
      expect(expenses).toEqual(expect.arrayContaining([expenseShape(expenseCreateDto)]));
    });
  });

  describe('getExpenseById()', () => {
    it('should get expense by id', async () => {
      const expenseCreateDto: Prisma.ExpenseCreateInput = {
        name: 'Rent',
        amount: '1500.00',
        dueDate: '01/01/2024',
        isAllocated: false,
        isPaid: false,
      };
      const {
        body: { id },
      } = await expenseReq.createExpense(expenseCreateDto);
      const { body: expenseCreated } = await expenseReq.getExpenseById(id);
      expect(expenseCreated).toEqual(expenseShape(expenseCreated));
    });

    it('should throw an error when trying to retrieve an expense that does not exists', async () => {
      const expenseId = -1;
      const { body, status } = await expenseReq.getExpenseById(expenseId);
      expect(body.message).toEqual(ExpenseError.CouldNotGetExpenseById);
      expect(status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('createExpense()', () => {
    it('should create expense', async () => {
      const expenseCreateDto: Prisma.ExpenseCreateInput = {
        name: 'Rent',
        amount: '1500.00',
        dueDate: '01/01/2024',
        isAllocated: false,
        isPaid: false,
      };
      const {
        body: { id },
      } = await expenseReq.createExpense(expenseCreateDto);
      const { body: expense } = await expenseReq.getExpenseById(id);
      expect(expense).toEqual(expenseShape(expenseCreateDto));
    });
  });

  describe('updateExpense()', () => {
    it('should update expense', async () => {
      const expenseCreateDto: Prisma.ExpenseCreateInput = {
        name: 'Rent',
        amount: '1500.00',
        dueDate: '01/01/2024',
        isAllocated: false,
        isPaid: false,
      };

      const {
        body: { id },
      } = await expenseReq.createExpense(expenseCreateDto);

      await expenseReq.updateExpense(id, { name: 'Groceries' });
      await expenseReq.updateExpense(id, { amount: '1000.00' });
      await expenseReq.updateExpense(id, { dueDate: '01/04/2024' });
      await expenseReq.updateExpense(id, { isAllocated: true });
      await expenseReq.updateExpense(id, { isPaid: true });

      const { body: expense } = await expenseReq.getExpenseById(id);
      expect(expense).toEqual(
        expenseShape({
          name: 'Groceries',
          amount: '1000.00',
          dueDate: '01/04/2024',
          isAllocated: true,
          isPaid: true,
        }),
      );
    });

    it('should throw an error when trying to update expense that does not exists', async () => {
      const expenseId = -1;
      const { body, statusCode } = await expenseReq.updateExpense(expenseId, {});
      expect(body.message).toEqual(ExpenseError.CouldNotUpdateExpense);
      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('deleteExpense()', () => {
    it('should delete expense', async () => {
      const expenseCreateDto: Prisma.ExpenseCreateInput = {
        name: 'Rent',
        amount: '1500.00',
        dueDate: '01/01/2024',
        isAllocated: false,
        isPaid: false,
      };

      const {
        body: { id },
      } = await expenseReq.createExpense(expenseCreateDto);
      const { body, statusCode } = await expenseReq.deleteExpense(id);

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(body).toEqual(expenseShape(expenseCreateDto));
    });

    it('should throw an error when trying to delete expense that does not exists', async () => {
      const expenseId = -1;
      const { body, statusCode } = await expenseReq.deleteExpense(expenseId);
      expect(body.message).toEqual(ExpenseError.CouldNotDeleteExpense);
      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
