-- DropForeignKey
ALTER TABLE "orderItem" DROP CONSTRAINT "orderItem_order_id_fkey";

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;
