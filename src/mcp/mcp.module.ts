import { Module } from '@nestjs/common';
import { McpService } from './mcp.service';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [CarsModule],
  providers: [McpService],
  exports: [McpService],
})
export class McpModule {}
