-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "totalCents" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerCompany" TEXT,
    "customerMessage" TEXT,
    "gdprConsent" BOOLEAN NOT NULL DEFAULT false,
    "paypalOrderId" TEXT,
    "paypalCaptureId" TEXT
);
INSERT INTO "new_Order" ("createdAt", "currency", "customerCompany", "customerEmail", "customerMessage", "customerName", "customerPhone", "gdprConsent", "id", "paypalCaptureId", "paypalOrderId", "status", "totalCents") SELECT "createdAt", "currency", "customerCompany", "customerEmail", "customerMessage", "customerName", "customerPhone", "gdprConsent", "id", "paypalCaptureId", "paypalOrderId", "status", "totalCents" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_paypalOrderId_key" ON "Order"("paypalOrderId");
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "unitCents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("id", "orderId", "quantity", "serviceId", "title", "unitCents") SELECT "id", "orderId", "quantity", "serviceId", "title", "unitCents" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
