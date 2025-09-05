import { Prisma } from "@prisma/client";
export declare function createTenant(data: Prisma.TenantCreateInput): Promise<{
    name: string;
    id: string;
    created_at: Date;
    contact_email: string;
}>;
export declare function getTenantById(id: string): Promise<({
    gateways: ({
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
    })[];
} & {
    name: string;
    id: string;
    created_at: Date;
    contact_email: string;
}) | null>;
export declare function updateTenant(id: string, data: Prisma.TenantUpdateInput): Promise<{
    name: string;
    id: string;
    created_at: Date;
    contact_email: string;
}>;
export declare function deleteTenant(id: string): Promise<{
    name: string;
    id: string;
    created_at: Date;
    contact_email: string;
}>;
export declare function listTenants(): Promise<({
    gateways: ({
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
    })[];
} & {
    name: string;
    id: string;
    created_at: Date;
    contact_email: string;
})[]>;
//# sourceMappingURL=tenant.repository.d.ts.map