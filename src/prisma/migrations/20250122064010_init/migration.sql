-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Seller', 'Buyer');

-- CreateTable
CREATE TABLE "user" (
    "type" "UserType" NOT NULL,
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request" (
    "id" SERIAL NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "buyerId" INTEGER,
    "scrapDetails" TEXT NOT NULL,
    "pickupType" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request" ADD CONSTRAINT "request_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
