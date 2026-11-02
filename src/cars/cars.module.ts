import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';

@Module({
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
