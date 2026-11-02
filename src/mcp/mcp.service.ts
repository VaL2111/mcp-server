import { Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { CarsService } from '../cars/cars.service';
import { Car, CarCondition } from '../generated/prisma/client';

@Injectable()
export class McpService {
  private readonly server: McpServer;

  constructor(private readonly carsService: CarsService) {
    this.server = new McpServer({
      name: 'cars-db-mcp-server',
      version: '1.0.0',
    });

    this.registerTools();
  }

  private formatResult(cars: Car[]) {
    if (cars.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'Автомобілів за цим запитом у базі даних не знайдено.',
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(cars, null, 2),
        },
      ],
    };
  }

  private registerTools(): void {
    this.server.registerTool(
      'get_all_cars',
      {
        description:
          'Отримати повний список усіх автомобілів із бази даних без фільтрації.',
      },
      async () => {
        const cars = await this.carsService.findAll();
        return this.formatResult(cars);
      },
    );

    this.server.registerTool(
      'sort_cars',
      {
        description:
          'Отримати список автомобілів із бази даних, відсортований за вказаним полем та напрямком (asc/desc).',
        inputSchema: {
          sortBy: z
            .enum([
              'year',
              'brand',
              'color',
              'condition',
              'ownerLastName',
              'licensePlate',
            ])
            .describe('Поле для сортування автомобілів'),
          order: z
            .enum(['asc', 'desc'])
            .default('asc')
            .describe(
              'Напрямок сортування: asc (за зростанням) або desc (за спаданням)',
            ),
        },
      },
      async ({ sortBy, order }) => {
        const cars = await this.carsService.findSorted(sortBy, order);
        return this.formatResult(cars);
      },
    );

    this.server.registerTool(
      'search_cars',
      {
        description:
          'Пошук автомобілів у базі даних за одним або кількома параметрами (номер, марка, колір, стан, прізвище власника, адреса, діапазон років випуску).',
        inputSchema: {
          licensePlate: z
            .string()
            .optional()
            .describe('Номерний знак авто (або його частина)'),
          brand: z
            .string()
            .optional()
            .describe('Марка автомобіля (наприклад: BMW, Audi, Toyota)'),
          color: z
            .string()
            .optional()
            .describe(
              'Колір автомобіля англійською (наприклад: Black, White, Blue)',
            ),
          condition: z
            .nativeEnum(CarCondition)
            .optional()
            .describe(
              'Стан авто: NEW (новий), USED (вживаний), DAMAGED (пошкоджений)',
            ),
          ownerLastName: z.string().optional().describe('Прізвище власника'),
          address: z.string().optional().describe('Адреса або місто власника'),
          minYear: z
            .number()
            .int()
            .optional()
            .describe('Мінімальний рік випуску (включно)'),
          maxYear: z
            .number()
            .int()
            .optional()
            .describe('Максимальний рік випуску (включно)'),
        },
      },
      async (filters) => {
        const cars = await this.carsService.search(filters);
        return this.formatResult(cars);
      },
    );
  }

  async startStdio(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}
