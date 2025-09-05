-- Create enum type "DeviceStatus"
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'MAINTENANCE');
-- Create "Tenant" table
CREATE TABLE "Tenant" (
  "id" uuid NOT NULL,
  "name" text NOT NULL,
  "contact_email" text NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);
-- Create index "Tenant_contact_email_key" to table: "Tenant"
CREATE UNIQUE INDEX "Tenant_contact_email_key" ON "Tenant" ("contact_email");
-- Create index "Tenant_name_key" to table: "Tenant"
CREATE UNIQUE INDEX "Tenant_name_key" ON "Tenant" ("name");
-- Create "Gateway" table
CREATE TABLE "Gateway" (
  "id" uuid NOT NULL,
  "serial_number" text NOT NULL,
  "name" text NOT NULL,
  "ipv4_address" text NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL,
  "tenant_id" uuid NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "Gateway_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "Tenant" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);
-- Create index "Gateway_ipv4_address_key" to table: "Gateway"
CREATE UNIQUE INDEX "Gateway_ipv4_address_key" ON "Gateway" ("ipv4_address");
-- Create index "Gateway_serial_number_key" to table: "Gateway"
CREATE UNIQUE INDEX "Gateway_serial_number_key" ON "Gateway" ("serial_number");
-- Create "GatewayLog" table
CREATE TABLE "GatewayLog" (
  "id" uuid NOT NULL,
  "gateway_id" uuid NOT NULL,
  "action" text NOT NULL,
  "details" jsonb NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "GatewayLog_gateway_id_fkey" FOREIGN KEY ("gateway_id") REFERENCES "Gateway" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);
-- Create "DeviceType" table
CREATE TABLE "DeviceType" (
  "id" serial NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "DeviceType_name_key" to table: "DeviceType"
CREATE UNIQUE INDEX "DeviceType_name_key" ON "DeviceType" ("name");
-- Create "PeripheralDevice" table
CREATE TABLE "PeripheralDevice" (
  "id" uuid NOT NULL,
  "uid" bigint NOT NULL,
  "vendor" text NOT NULL,
  "status" "DeviceStatus" NOT NULL,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_seen" timestamp(3) NULL,
  "gateway_id" uuid NOT NULL,
  "device_type_id" integer NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "PeripheralDevice_device_type_id_fkey" FOREIGN KEY ("device_type_id") REFERENCES "DeviceType" ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "PeripheralDevice_gateway_id_fkey" FOREIGN KEY ("gateway_id") REFERENCES "Gateway" ("id") ON UPDATE CASCADE ON DELETE RESTRICT
);
-- Create index "PeripheralDevice_uid_key" to table: "PeripheralDevice"
CREATE UNIQUE INDEX "PeripheralDevice_uid_key" ON "PeripheralDevice" ("uid");
