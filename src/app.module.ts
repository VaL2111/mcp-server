import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CarsModule } from './cars/cars.module';
import { McpModule } from './mcp/mcp.module';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'),
    }),
    PrismaModule,
    CarsModule,
    McpModule,
  ],
})
export class AppModule {}
