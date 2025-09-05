import { z } from 'zod';

export const UuidParamSchema = z.object({
  id: z.uuid('Invalid UUID format')
});

export const DeviceAttachSchema = z.object({
  deviceId: z.uuid('Invalid device ID format')
});
