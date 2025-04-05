-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "lastAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockedUntil" TIMESTAMP(3),

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LoginAttempt_ipAddress_idx" ON "LoginAttempt"("ipAddress");
