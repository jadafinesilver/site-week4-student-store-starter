/*
  Warnings:

  - A unique constraint covering the columns `[customer_id]` on the table `order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "order_customer_id_key" ON "order"("customer_id");
