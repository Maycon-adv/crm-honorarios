-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Collaborator',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "document" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Agreement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recordNumber" TEXT NOT NULL,
    "processNumber" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "responsibleCollaborator" TEXT NOT NULL,
    "agreementType" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "agreedValue" REAL NOT NULL,
    "agreementDate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OnTime',
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Agreement_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Installment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agreementId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "value" REAL NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "paymentDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Installment_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agreementId" TEXT NOT NULL,
    "agreementParty" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "agreementId" TEXT,
    "agreementRecordNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActivityLog_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GoalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "goal" REAL NOT NULL,
    "achieved" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_recordNumber_key" ON "Agreement"("recordNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Installment_agreementId_installmentNumber_key" ON "Installment"("agreementId", "installmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GoalRecord_month_key" ON "GoalRecord"("month");
