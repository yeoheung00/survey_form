-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "pw" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");
