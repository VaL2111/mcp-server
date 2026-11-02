import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, CarsModule],
})
export class AppModule {}
