-- Create enum type "GatewayStatus"
CREATE TYPE "GatewayStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DECOMMISSIONED');
-- Modify "Gateway" table
ALTER TABLE "Gateway" ADD COLUMN "status" "GatewayStatus" NOT NULL DEFAULT 'INACTIVE', ADD COLUMN "location" text NULL;
-- Modify "PeripheralDevice" table
ALTER TABLE "PeripheralDevice" ALTER COLUMN "status" SET DEFAULT 'OFFLINE';
