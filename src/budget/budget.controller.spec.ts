import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { ExpenseReq } from '../expense/expense-test.utils';
import { ExpenseModule } from '../expense/expense.module';
import { PrismaService } from '../prisma/prisma.service';
import { BudgetReq, budgetShape } from './budget-test.utils';
import { BudgetError } from './budget.model';
import { BudgetModule } from './budget.module';

describe('BudgetController', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let budgetReq: BudgetReq;
  let expenseReq: ExpenseReq;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BudgetModule, ExpenseModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = module.get(PrismaService);
    budgetReq = new BudgetReq(app);
    expenseReq = new ExpenseReq(app);

    await app.init();
    await prismaService.cleanDatabase();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getAllBudgets()', () => {
    it('should get all budgets', async () => {
      const budgetCreateDto: Prisma.BudgetCreateInput = {
        name: 'Rent',
        month: 'January',
        year: 2024,
      };
      await budgetReq.createBudget(budgetCreateDto);
      const { body: budgets } = await budgetReq.getAllBudgets();
      expect(budgets).toEqual(expect.arrayContaining([budgetShape(budgetCreateDto)]));
    });
  });

  describe('getBudgetById()', () => {
    it('should get budget by id', async () => {
      const budgetCreateDto: Prisma.BudgetCreateInput = {
        name: 'Rent',
        month: 'January',
        year: 2024,
      };
      const {
        body: { id },
      } = await budgetReq.createBudget(budgetCreateDto);
      const { body: budgetCreated } = await budgetReq.getBudgetById(id);
      expect(budgetCreated).toEqual(budgetShape(budgetCreated));
    });

    it('should throw an error when trying to retrieve budget that does not exists', async () => {
      const budgetId = -1;
      const { body, status } = await budgetReq.getBudgetById(budgetId);
      expect(body.message).toEqual(BudgetError.CouldNotGetBudgetById);
      expect(status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('createBudget()', () => {
    it('should create budget', async () => {
      const budgetCreateDto: Prisma.BudgetCreateInput = {
        name: 'Rent',
        month: 'January',
        year: 2024,
      };
      const {
        body: { id },
      } = await budgetReq.createBudget(budgetCreateDto);
      const { body: budget } = await budgetReq.getBudgetById(id);
      expect(budget).toEqual(budgetShape(budgetCreateDto));
    });
  });

  describe('updateBudget()', () => {
    it('should update budget', async () => {
      const budgetCreateDto: Prisma.BudgetCreateInput = {
        name: 'Rent',
        month: 'January',
        year: 2024,
      };

      const {
        body: { id },
      } = await budgetReq.createBudget(budgetCreateDto);

      await budgetReq.updateBudget(id, { name: 'Groceries' });
      await budgetReq.updateBudget(id, { month: 'February' });
      await budgetReq.updateBudget(id, { year: 2025 });

      const { body: budget } = await budgetReq.getBudgetById(id);
      expect(budget).toEqual(
        budgetShape({
          name: 'Groceries',
          month: 'February',
          year: 2025,
        }),
      );
    });

    it('should throw an error when trying to update budget that does not exists', async () => {
      const budgetId = -1;
      const { body, statusCode } = await budgetReq.updateBudget(budgetId, {});
      expect(body.message).toEqual(BudgetError.CouldNotUpdateBudget);
      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('addExpenseToBudget()', () => {
    it('should add expense to budget', async () => {
      const budgetCreateDto: Prisma.BudgetCreateInput = {
        name: 'Rent',
        month: 'January',
        year: 2024,
      };

      const {
        body: { id },
      } = await budgetReq.createBudget(budgetCreateDto);

      const expenseCreateDto: Prisma.ExpenseCreateInput = {
        name: 'Rent',
        amount: '1500.00',
        dueDate: '01/01/2024',
        isAllocated: false,
        isPaid: false,
        budget: {
          connect: { id },
        },
      };
      await expenseReq.createExpense(expenseCreateDto);

      const { body: budget } = await budgetReq.getBudgetById(id);
      expect(budget.expenses).toHaveLength(1);
    });
  });

  describe('removeExpenseFromBudget()', () => {
    it('should remove expense from budget', async () => {
      const budgetCreateDto: Prisma.BudgetCreateInput = {
        name: 'Rent',
        month: 'January',
        year: 2024,
      };

      const {
        body: { id },
      } = await budgetReq.createBudget(budgetCreateDto);

      const expenseCreateDto: Prisma.ExpenseCreateInput = {
        name: 'Rent',
        amount: '1500.00',
        dueDate: '01/01/2024',
        isAllocated: false,
        isPaid: false,
        budget: {
          connect: { id },
        },
      };
      const {
        body: { id: expenseId },
      } = await expenseReq.createExpense(expenseCreateDto);
      await expenseReq.deleteExpense(expenseId);

      const { body: budget } = await budgetReq.getBudgetById(id);
      expect(budget.expenses).toHaveLength(0);
    });
  });

  describe('deleteBudget()', () => {
    it('should delete budget', async () => {
      const budgetCreateDto: Prisma.BudgetCreateInput = {
        name: 'Rent',
        month: 'January',
        year: 2024,
      };

      const {
        body: { id },
      } = await budgetReq.createBudget(budgetCreateDto);
      const { body, statusCode } = await budgetReq.deleteBudget(id);

      expect(statusCode).toEqual(HttpStatus.OK);
      expect(body).toEqual(budgetShape(budgetCreateDto));
    });

    it('should throw an error when trying to delete budget that does not exists', async () => {
      const budgetId = -1;
      const { body, statusCode } = await budgetReq.deleteBudget(budgetId);
      expect(body.message).toEqual(BudgetError.CouldNotDeleteBudget);
      expect(statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
