import * as deviceRepo from '../repositories/device.repository';
export const createDevice = async (req, res, next) => {
    try {
        const deviceData = req.body;
        // Check if UID already exists
        const uidExists = await deviceRepo.uidExists(BigInt(deviceData.uid));
        if (uidExists) {
            res.status(409).json({ error: 'Device UID already exists' });
            return;
        }
        // Prepare data for Prisma with device_type relationship
        const prismaData = {
            uid: BigInt(deviceData.uid),
            vendor: deviceData.vendor,
            status: deviceData.status,
            device_type: {
                connect: { id: deviceData.device_type_id }
            },
            ...(deviceData.gateway_id && {
                gateway: {
                    connect: { id: deviceData.gateway_id }
                }
            })
        };
        const newDevice = await deviceRepo.createDevice(prismaData);
        res.status(201).json(newDevice);
    }
    catch (error) {
        next(error);
    }
};
export const listDevices = async (req, res, next) => {
    try {
        const devices = await deviceRepo.listDevices();
        res.json(devices);
    }
    catch (error) {
        next(error);
    }
};
export const getDeviceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const device = await deviceRepo.getDeviceById(id);
        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }
        res.json(device);
    }
    catch (error) {
        next(error);
    }
};
export const updateDevice = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deviceData = req.body;
        // Check if device exists
        const existingDevice = await deviceRepo.getDeviceById(id);
        if (!existingDevice) {
            res.status(404).json({ error: 'Device not found' });
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
                connect: { id: deviceData.device_type_id }
            };
        }
        const updatedDevice = await deviceRepo.updateDevice(id, updateData);
        res.json(updatedDevice);
    }
    catch (error) {
        next(error);
    }
};
export const deleteDevice = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Check if device exists
        const existingDevice = await deviceRepo.getDeviceById(id);
        if (!existingDevice) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }
        await deviceRepo.deleteDevice(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
export const getOrphanDevices = async (req, res, next) => {
    try {
        const devices = await deviceRepo.getOrphanDevices();
        res.json(devices);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=device.controller.js.map