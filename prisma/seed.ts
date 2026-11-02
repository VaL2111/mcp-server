import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { CarCondition, PrismaClient } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const cars = [
    {
      licensePlate: 'AA1234BB',
      year: 2023,
      brand: 'BMW',
      color: 'Black',
      condition: CarCondition.NEW,
      ownerLastName: 'Коваленко',
      address: 'м. Київ, вул. Хрещатик, 10',
    },
    {
      licensePlate: 'BC5678CE',
      year: 2019,
      brand: 'Audi',
      color: 'White',
      condition: CarCondition.USED,
      ownerLastName: 'Шевченко',
      address: 'м. Львів, пр. Свободи, 25',
    },
    {
      licensePlate: 'KA9012OO',
      year: 2016,
      brand: 'Toyota',
      color: 'Silver',
      condition: CarCondition.DAMAGED,
      ownerLastName: 'Бондаренко',
      address: 'м. Київ, вул. Велика Васильківська, 44',
    },
    {
      licensePlate: 'AT3456IK',
      year: 2021,
      brand: 'BMW',
      color: 'Blue',
      condition: CarCondition.USED,
      ownerLastName: 'Мельник',
      address: 'м. Івано-Франківськ, вул. Незалежності, 12',
    },
    {
      licensePlate: 'BH7890AA',
      year: 2024,
      brand: 'Volkswagen',
      color: 'Gray',
      condition: CarCondition.NEW,
      ownerLastName: 'Ткаченко',
      address: 'м. Одеса, вул. Дерибасівська, 5',
    },
  ];

  for (const car of cars) {
    await prisma.car.upsert({
      where: { licensePlate: car.licensePlate },
      update: car,
      create: car,
    });
  }

  console.log(`Seeded ${cars.length} cars successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
