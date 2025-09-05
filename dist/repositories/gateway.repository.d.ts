import { Prisma } from "@prisma/client";
export declare function serialNumberExists(serialNumber: string): Promise<boolean>;
export declare function ipv4AddressExists(ipv4Address: string): Promise<boolean>;
export declare function createGateway(data: Prisma.GatewayCreateInput): Promise<{
    devices: ({
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
    })[];
    tenant: {
        name: string;
        id: string;
        created_at: Date;
        contact_email: string;
    };
} & {
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.GatewayStatus;
    created_at: Date;
    serial_number: string;
    ipv4_address: string;
    location: string | null;
    updated_at: Date;
    tenant_id: string;
}>;
export declare function getGatewayById(id: string): Promise<({
    devices: ({
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
    })[];
    tenant: {
        name: string;
        id: string;
        created_at: Date;
        contact_email: string;
    };
} & {
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.GatewayStatus;
    created_at: Date;
    serial_number: string;
    ipv4_address: string;
    location: string | null;
    updated_at: Date;
    tenant_id: string;
}) | null>;
export declare function updateGateway(id: string, data: Prisma.GatewayUpdateInput): Promise<{
    devices: ({
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
    })[];
    tenant: {
        name: string;
        id: string;
        created_at: Date;
        contact_email: string;
    };
} & {
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.GatewayStatus;
    created_at: Date;
    serial_number: string;
    ipv4_address: string;
    location: string | null;
    updated_at: Date;
    tenant_id: string;
}>;
export declare function deleteGateway(id: string): Promise<{
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.GatewayStatus;
    created_at: Date;
    serial_number: string;
    ipv4_address: string;
    location: string | null;
    updated_at: Date;
    tenant_id: string;
}>;
export declare function listGateways(): Promise<({
    devices: ({
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
    })[];
    tenant: {
        name: string;
        id: string;
        created_at: Date;
        contact_email: string;
    };
} & {
    name: string;
    id: string;
    status: import("@prisma/client").$Enums.GatewayStatus;
    created_at: Date;
    serial_number: string;
    ipv4_address: string;
    location: string | null;
    updated_at: Date;
    tenant_id: string;
})[]>;
export declare function createGatewayLog(gatewayId: string, action: string, details: Record<string, any>): Promise<void>;
//# sourceMappingURL=gateway.repository.d.ts.map