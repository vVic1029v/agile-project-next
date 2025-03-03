-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "allUsers" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnnouncementHomeClass" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AnnouncementHomeClass_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AnnouncementHomeClass_B_index" ON "_AnnouncementHomeClass"("B");

-- AddForeignKey
ALTER TABLE "_AnnouncementHomeClass" ADD CONSTRAINT "_AnnouncementHomeClass_A_fkey" FOREIGN KEY ("A") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnnouncementHomeClass" ADD CONSTRAINT "_AnnouncementHomeClass_B_fkey" FOREIGN KEY ("B") REFERENCES "HomeClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
