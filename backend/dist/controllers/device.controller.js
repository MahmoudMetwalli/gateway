import * as deviceService from "../services/device.service.js";
import { serialize } from "../utils/serializer.js";
import wrapAsync from "../utils/errorCatcher.js";
const createDevice = async (req, res, next) => {
    const deviceData = req.body;
    // Check if UID already exists
    const uidExists = await deviceService.uidExists(BigInt(deviceData.uid));
    if (uidExists) {
        res.status(409).json({ error: "Device UID already exists" });
        return;
    }
    // Prepare data for Prisma with device_type relationship
    const prismaData = {
        uid: BigInt(deviceData.uid),
        vendor: deviceData.vendor,
        status: deviceData.status,
        device_type: {
            connect: { id: deviceData.device_type_id },
        },
        ...(deviceData.gateway_id && {
            gateway: {
                connect: { id: deviceData.gateway_id },
            },
        }),
    };
    const newDevice = await deviceService.createDevice(prismaData);
    res.status(201).json(serialize(newDevice));
};
const listDevices = async (req, res, next) => {
    const devices = await deviceService.listDevices();
    res.json(serialize(devices));
};
const getDeviceById = async (req, res, next) => {
    const { id } = req.params;
    const device = await deviceService.getDeviceById(id);
    if (!device) {
        res.status(404).json({ error: "Device not found" });
        return;
    }
    res.json(serialize(device));
};
const updateDevice = async (req, res, next) => {
    const { id } = req.params;
    const deviceData = req.body;
    // Check if device exists
    const existingDevice = await deviceService.getDeviceById(id);
    if (!existingDevice) {
        res.status(404).json({ error: "Device not found" });
        return;
    }
    // Filter out undefined values and prepare update data for Prisma
    const updateData = {};
    if (deviceData.vendor !== undefined)
        updateData.vendor = deviceData.vendor;
    if (deviceData.status !== undefined)
        updateData.status = deviceData.status;
    if (deviceData.last_seen_at !== undefined)
        updateData.last_seen_at = deviceData.last_seen_at;
    if (deviceData.device_type_id !== undefined) {
        updateData.device_type = {
            connect: { id: deviceData.device_type_id },
        };
    }
    const updatedDevice = await deviceService.updateDevice(id, updateData);
    res.json(serialize(updatedDevice));
};
const deleteDevice = async (req, res, next) => {
    const { id } = req.params;
    // Check if device exists
    const existingDevice = await deviceService.getDeviceById(id);
    if (!existingDevice) {
        res.status(404).json({ error: "Device not found" });
        return;
    }
    await deviceService.deleteDevice(id);
    res.status(204).send();
};
const getOrphanDevices = async (req, res, next) => {
    const devices = await deviceService.getOrphanDevices();
    res.json(serialize(devices));
};
const deviceController = {
    createDevice: wrapAsync(createDevice),
    listDevices: wrapAsync(listDevices),
    getDeviceById: wrapAsync(getDeviceById),
    updateDevice: wrapAsync(updateDevice),
    deleteDevice: wrapAsync(deleteDevice),
    getOrphanDevices: wrapAsync(getOrphanDevices),
};
export default deviceController;
//# sourceMappingURL=device.controller.js.map