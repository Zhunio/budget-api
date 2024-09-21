import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';

@Module({
  imports: [PrismaModule],
  providers: [IncomeService],
  controllers: [IncomeController],
  exports: [IncomeService],
})
export class IncomeModule {}
