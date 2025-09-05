import { z, ZodError } from 'zod';
export const validateRequest = (schemas) => {
    return (req, res, next) => {
        const errors = [];
        // Validate each provided schema
        Object.entries(schemas).forEach(([target, schema]) => {
            if (schema) {
                try {
                    schema.parse(req[target]);
                }
                catch (error) {
                    if (error instanceof ZodError) {
                        errors.push({
                            target,
                            issues: error.issues.map(issue => ({
                                ...issue,
                                path: [`${target}`, ...issue.path] // Prefix with target
                            }))
                        });
                    }
                }
            }
        });
        if (errors.length > 0) {
            const allIssues = errors.flatMap(error => error.issues);
            res.status(400).json({
                error: 'Validation failed',
                details: allIssues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }))
            });
            return;
        }
        next();
    };
};
// Common parameter schemas
export const UuidParamSchema = z.object({
    id: z.uuid('Invalid UUID format')
});
export const DeviceAttachSchema = z.object({
    deviceId: z.uuid('Invalid device ID format')
});
//# sourceMappingURL=validation.middleware.js.map