-- Modify "GatewayLog" table
ALTER TABLE "GatewayLog" DROP CONSTRAINT "GatewayLog_gateway_id_fkey";
-- Modify "Gateway" table
ALTER TABLE "Gateway" DROP CONSTRAINT "Gateway_tenant_id_fkey", ADD CONSTRAINT "Gateway_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
-- Modify "PeripheralDevice" table
ALTER TABLE "PeripheralDevice" DROP CONSTRAINT "PeripheralDevice_gateway_id_fkey", ALTER COLUMN "gateway_id" DROP NOT NULL, ADD CONSTRAINT "PeripheralDevice_gateway_id_fkey" FOREIGN KEY ("gateway_id") REFERENCES "Gateway" ("id") ON UPDATE CASCADE ON DELETE SET NULL;
