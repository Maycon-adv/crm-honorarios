-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Dev', 'Collaborator');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('OnTime', 'Overdue', 'Paid', 'Cancelled');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('Pending', 'Overdue', 'Paid');

-- CreateEnum
CREATE TYPE "AgreementType" AS ENUM ('PreExecution', 'PostExecution');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Boleto', 'Pix', 'Transferencia', 'Cartao');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('Overdue', 'Upcoming');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'Completed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'Collaborator',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "document" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agreement" (
    "id" TEXT NOT NULL,
    "recordNumber" TEXT NOT NULL,
    "processNumber" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "responsibleCollaborator" TEXT NOT NULL,
    "agreementType" "AgreementType" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "agreedValue" DOUBLE PRECISION NOT NULL,
    "agreementDate" TEXT NOT NULL,
    "status" "AgreementStatus" NOT NULL DEFAULT 'OnTime',
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Installment" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" "InstallmentStatus" NOT NULL DEFAULT 'Pending',
    "paymentDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "agreementParty" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "agreementId" TEXT,
    "agreementRecordNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalRecord" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "goal" DOUBLE PRECISION NOT NULL,
    "achieved" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_recordNumber_key" ON "Agreement"("recordNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Installment_agreementId_installmentNumber_key" ON "Installment"("agreementId", "installmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GoalRecord_month_key" ON "GoalRecord"("month");

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
