import { Prisma } from "@prisma/client";
export declare function uidExists(uid: bigint): Promise<boolean>;
export declare function createDevice(data: Prisma.PeripheralDeviceCreateInput): Promise<{
    gateway: {
        name: string;
        id: string;
        status: import("@prisma/client").$Enums.GatewayStatus;
        created_at: Date;
        serial_number: string;
        ipv4_address: string;
        location: string | null;
        updated_at: Date;
        tenant_id: string;
    } | null;
    device_type: {
        name: string;
        id: number;
        description: string;
    };
} & {
    id: string;
    uid: bigint;
    vendor: string;
    status: import("@prisma/client").$Enums.DeviceStatus;
    created_at: Date;
    last_seen: Date | null;
    gateway_id: string | null;
    device_type_id: number;
}>;
export declare function listDevices(): Promise<({
    gateway: {
        name: string;
        id: string;
        status: import("@prisma/client").$Enums.GatewayStatus;
        created_at: Date;
        serial_number: string;
        ipv4_address: string;
        location: string | null;
        updated_at: Date;
        tenant_id: string;
    } | null;
    device_type: {
        name: string;
        id: number;
        description: string;
    };
} & {
    id: string;
    uid: bigint;
    vendor: string;
    status: import("@prisma/client").$Enums.DeviceStatus;
    created_at: Date;
    last_seen: Date | null;
    gateway_id: string | null;
    device_type_id: number;
})[]>;
export declare function getDeviceById(id: string): Promise<({
    gateway: {
        name: string;
        id: string;
        status: import("@prisma/client").$Enums.GatewayStatus;
        created_at: Date;
        serial_number: string;
        ipv4_address: string;
        location: string | null;
        updated_at: Date;
        tenant_id: string;
    } | null;
    device_type: {
        name: string;
        id: number;
        description: string;
    };
} & {
    id: string;
    uid: bigint;
    vendor: string;
    status: import("@prisma/client").$Enums.DeviceStatus;
    created_at: Date;
    last_seen: Date | null;
    gateway_id: string | null;
    device_type_id: number;
}) | null>;
export declare function updateDevice(id: string, data: Prisma.PeripheralDeviceUpdateInput): Promise<{
    gateway: {
        name: string;
        id: string;
        status: import("@prisma/client").$Enums.GatewayStatus;
        created_at: Date;
        serial_number: string;
        ipv4_address: string;
        location: string | null;
        updated_at: Date;
        tenant_id: string;
    } | null;
    device_type: {
        name: string;
        id: number;
        description: string;
    };
} & {
    id: string;
    uid: bigint;
    vendor: string;
    status: import("@prisma/client").$Enums.DeviceStatus;
    created_at: Date;
    last_seen: Date | null;
    gateway_id: string | null;
    device_type_id: number;
}>;
export declare function deleteDevice(id: string): Promise<{
    id: string;
    uid: bigint;
    vendor: string;
    status: import("@prisma/client").$Enums.DeviceStatus;
    created_at: Date;
    last_seen: Date | null;
    gateway_id: string | null;
    device_type_id: number;
}>;
export declare function getOrphanDevices(): Promise<({
    device_type: {
        name: string;
        id: number;
        description: string;
    };
} & {
    id: string;
    uid: bigint;
    vendor: string;
    status: import("@prisma/client").$Enums.DeviceStatus;
    created_at: Date;
    last_seen: Date | null;
    gateway_id: string | null;
    device_type_id: number;
})[]>;
export declare function countDevicesInGateway(gatewayId: string): Promise<number>;
export declare function attachDeviceToGateway(deviceId: string, gatewayId: string): Promise<{
    gateway: {
        name: string;
        id: string;
        status: import("@prisma/client").$Enums.GatewayStatus;
        created_at: Date;
        serial_number: string;
        ipv4_address: string;
        location: string | null;
        updated_at: Date;
        tenant_id: string;
    } | null;
    device_type: {
        name: string;
        id: number;
        description: string;
    };
} & {
    id: string;
    uid: bigint;
    vendor: string;
    status: import("@prisma/client").$Enums.DeviceStatus;
    created_at: Date;
    last_seen: Date | null;
    gateway_id: string | null;
    device_type_id: number;
}>;
export declare function detachDeviceFromGateway(deviceId: string): Promise<{
    gateway: {
        name: string;
        id: string;
        status: import("@prisma/client").$Enums.GatewayStatus;
        created_at: Date;
        serial_number: string;
        ipv4_address: string;
        location: string | null;
        updated_at: Date;
        tenant_id: string;
    } | null;
    device_type: {
        name: string;
        id: number;
        description: string;
    };
} & {
    id: string;
    uid: bigint;
    vendor: string;
    status: import("@prisma/client").$Enums.DeviceStatus;
    created_at: Date;
    last_seen: Date | null;
    gateway_id: string | null;
    device_type_id: number;
}>;
//# sourceMappingURL=device.repository.d.ts.map