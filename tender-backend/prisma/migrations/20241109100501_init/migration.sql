-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT,
    "title" TEXT,
    "status" TEXT,
    "contractCondition" TEXT,
    "contractEnforced" TEXT,
    "customerName" TEXT,
    "customerLink" TEXT,
    "law" TEXT,
    "dateStart" TEXT,
    "dateEnd" TEXT
);

-- CreateTable
CREATE TABLE "Specification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "image" TEXT,
    "quantity" TEXT,
    "pricePerUnit" TEXT,
    "totalPrice" TEXT,
    "okpd2Code" TEXT,
    "okpd2Title" TEXT,
    "kpg3Code" TEXT,
    "kpg3Title" TEXT,
    "model" TEXT,
    "vendor" TEXT,
    "deliveryDates" TEXT,
    "deliveryQuantity" TEXT,
    "deliveryAddress" TEXT,
    "deliveryDetails" TEXT,
    "sessionId" INTEGER,
    CONSTRAINT "Specification_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "value" TEXT,
    "specificationId" INTEGER,
    CONSTRAINT "Property_specificationId_fkey" FOREIGN KEY ("specificationId") REFERENCES "Specification" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
