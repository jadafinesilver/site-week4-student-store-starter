-- DropForeignKey
ALTER TABLE "orderItem" DROP CONSTRAINT "orderItem_product_id_fkey";

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;
