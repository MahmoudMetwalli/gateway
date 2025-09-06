import { z, ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const validateRequest = (schemas: {
  body?: z.ZodSchema;
  params?: z.ZodSchema;
  query?: z.ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Array<{ target: string; issues: z.core.$ZodIssue[] }> = [];

    // Validate each provided schema
    Object.entries(schemas).forEach(([target, schema]) => {
      if (schema) {
        try {
          schema.parse(req[target as keyof typeof req]);
        } catch (error) {
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
        details: allIssues.map((err: z.ZodIssue) => ({
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

export default validateRequest;