import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Car, CarCondition } from '../generated/prisma/client';

export type SortableCarField =
  'year' | 'brand' | 'color' | 'condition' | 'ownerLastName' | 'licensePlate';

export type SortOrder = 'asc' | 'desc';

export interface SearchCarsFilter {
  licensePlate?: string;
  brand?: string;
  color?: string;
  condition?: CarCondition;
  ownerLastName?: string;
  address?: string;
  minYear?: number;
  maxYear?: number;
}

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Car[]> {
    return await this.prisma.car.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSorted(
    sortBy: SortableCarField,
    order: SortOrder = 'asc',
  ): Promise<Car[]> {
    return await this.prisma.car.findMany({
      orderBy: { [sortBy]: order },
    });
  }

  async search(filters: SearchCarsFilter): Promise<Car[]> {
    return this.prisma.car.findMany({
      where: {
        licensePlate: filters.licensePlate
          ? { contains: filters.licensePlate, mode: 'insensitive' }
          : undefined,
        brand: filters.brand
          ? { contains: filters.brand, mode: 'insensitive' }
          : undefined,
        color: filters.color
          ? { contains: filters.color, mode: 'insensitive' }
          : undefined,
        condition: filters.condition,
        ownerLastName: filters.ownerLastName
          ? { contains: filters.ownerLastName, mode: 'insensitive' }
          : undefined,
        address: filters.address
          ? { contains: filters.address, mode: 'insensitive' }
          : undefined,
        year:
          filters.minYear !== undefined || filters.maxYear !== undefined
            ? {
                gte: filters.minYear,
                lte: filters.maxYear,
              }
            : undefined,
      },
      orderBy: { year: 'desc' },
    });
  }
}
