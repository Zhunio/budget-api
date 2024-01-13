import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = module.get(PrismaService);

    await app.init();
  });

  it('should clean database', async () => {
    await prismaService.dummy.create({ data: { name: 'Dummy' } });
    await prismaService.cleanDatabase();
    const dummies = await prismaService.dummy.findMany();

    expect(dummies).toEqual([]);
  });

  it('should create dummy', async () => {
    const dummy = await prismaService.dummy.create({ data: { name: 'Dummy' } });
    expect(dummy).toEqual({ id: expect.any(Number), name: 'Dummy' });
  });
});
