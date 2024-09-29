/*
  Warnings:

  - You are about to drop the column `resoure_type` on the `Resource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "resoure_type",
ADD COLUMN     "resource_type" "Resource_Type" NOT NULL DEFAULT 'FILE';
