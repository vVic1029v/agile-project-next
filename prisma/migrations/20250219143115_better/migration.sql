/*
  Warnings:

  - You are about to drop the column `endTime` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Event` table. All the data in the column will be lost.
  - Made the column `timeSlotId` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `homeroomFacultyMemberId` on table `HomeClass` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_timeSlotId_fkey";

-- DropForeignKey
ALTER TABLE "HomeClass" DROP CONSTRAINT "HomeClass_homeroomFacultyMemberId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ALTER COLUMN "timeSlotId" SET NOT NULL;

-- AlterTable
ALTER TABLE "HomeClass" ALTER COLUMN "homeroomFacultyMemberId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TimeSlot" ALTER COLUMN "periodOfDay" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HomeClass" ADD CONSTRAINT "HomeClass_homeroomFacultyMemberId_fkey" FOREIGN KEY ("homeroomFacultyMemberId") REFERENCES "FacultyMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
