-- CreateEnum
CREATE TYPE "car_condition" AS ENUM ('NEW', 'USED', 'DAMAGED');

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "brand" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "condition" "car_condition" NOT NULL,
    "owner_last_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cars_license_plate_key" ON "cars"("license_plate");
