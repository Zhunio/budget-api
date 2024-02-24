import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { IncomeModule } from './income/income.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), IncomeModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
