import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [IncomeService],
  exports: [IncomeService],
})
export class IncomeModule {}
