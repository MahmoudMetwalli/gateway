import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import validateRequest from '../../../src/middlewares/validation.middleware';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockStatus = jest.fn().mockReturnThis();
    mockJson = jest.fn().mockReturnThis();
    
    mockRequest = {
      body: {},
      params: {},
      query: {}
    };
    
    mockResponse = {
      status: mockStatus as any,
      json: mockJson as any
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  // ============================================================================
  // validateRequest Function - Valid Data Tests
  // ============================================================================

  it('should call next() when all validations pass', () => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email()
    });

    mockRequest.body = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    const middleware = validateRequest({ body: bodySchema });
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockStatus).not.toHaveBeenCalled();
    expect(mockJson).not.toHaveBeenCalled();
  });

  it('should call next() when no schemas provided', () => {
    const middleware = validateRequest({});
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockStatus).not.toHaveBeenCalled();
    expect(mockJson).not.toHaveBeenCalled();
  });

  it('should validate multiple schemas successfully', () => {
    const bodySchema = z.object({
      name: z.string()
    });
    
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    const querySchema = z.object({
      limit: z.string().optional()
    });

    mockRequest.body = { name: 'Test Gateway' };
    mockRequest.params = { id: '123e4567-e89b-12d3-a456-426614174000' };
    mockRequest.query = { limit: '10' };

    const middleware = validateRequest({ 
      body: bodySchema, 
      params: paramsSchema, 
      query: querySchema 
    });
    
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockStatus).not.toHaveBeenCalled();
  });

  // ============================================================================
  // validateRequest Function - Body Validation Error Tests
  // ============================================================================

  it('should return 400 when body validation fails', () => {
    const bodySchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email format')
    });

    mockRequest.body = {
      name: '',
      email: 'invalid-email'
    };

    const middleware = validateRequest({ body: bodySchema });
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({
          field: 'body.name',
          message: 'Name is required',
          code: 'too_small'
        }),
        expect.objectContaining({
          field: 'body.email',
          message: 'Invalid email format',
          code: 'invalid_format'
        })
      ])
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 400 when required field is missing', () => {
    const bodySchema = z.object({
      name: z.string(),
      serial_number: z.string()
    });

    mockRequest.body = {
      name: 'Test Gateway'
      // serial_number is missing
    };

    const middleware = validateRequest({ body: bodySchema });
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({
          field: 'body.serial_number',
          message: 'Invalid input: expected string, received undefined',
          code: 'invalid_type'
        })
      ])
    });
  });

  // ============================================================================
  // validateRequest Function - Params Validation Error Tests
  // ============================================================================

  it('should return 400 when params validation fails', () => {
    const paramsSchema = z.object({
      id: z.string().uuid('Invalid UUID format')
    });

    mockRequest.params = {
      id: 'invalid-uuid'
    };

    const middleware = validateRequest({ params: paramsSchema });
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({
          field: 'params.id',
          message: 'Invalid UUID format',
          code: 'invalid_format'
        })
      ])
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // ============================================================================
  // validateRequest Function - Query Validation Error Tests
  // ============================================================================

  it('should return 400 when query validation fails', () => {
    const querySchema = z.object({
      limit: z.string().regex(/^\d+$/, 'Limit must be a number'),
      offset: z.string().regex(/^\d+$/, 'Offset must be a number').optional()
    });

    mockRequest.query = {
      limit: 'not-a-number',
      offset: 'also-not-a-number'
    };

    const middleware = validateRequest({ query: querySchema });
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({
          field: 'query.limit',
          message: 'Limit must be a number',
          code: 'invalid_format'
        }),
        expect.objectContaining({
          field: 'query.offset',
          message: 'Offset must be a number',
          code: 'invalid_format'
        })
      ])
    });
  });

  // ============================================================================
  // validateRequest Function - Multiple Schema Error Tests
  // ============================================================================

  it('should return 400 with errors from multiple schemas', () => {
    const bodySchema = z.object({
      name: z.string().min(1)
    });
    
    const paramsSchema = z.object({
      id: z.string().uuid()
    });

    mockRequest.body = { name: '' };
    mockRequest.params = { id: 'invalid-uuid' };

    const middleware = validateRequest({ 
      body: bodySchema, 
      params: paramsSchema 
    });
    
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({
          field: 'body.name',
          message: 'Too small: expected string to have >=1 characters',
          code: 'too_small'
        }),
        expect.objectContaining({
          field: 'params.id',
          message: 'Invalid UUID',
          code: 'invalid_format'
        })
      ])
    });
  });

  // ============================================================================
  // validateRequest Function - Complex Nested Object Tests
  // ============================================================================

  it('should handle nested object validation errors', () => {
    const bodySchema = z.object({
      gateway: z.object({
        name: z.string().min(1),
        settings: z.object({
          timeout: z.number().positive()
        })
      })
    });

    mockRequest.body = {
      gateway: {
        name: '',
        settings: {
          timeout: -1
        }
      }
    };

    const middleware = validateRequest({ body: bodySchema });
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({
          field: 'body.gateway.name',
          code: 'too_small'
        }),
        expect.objectContaining({
          field: 'body.gateway.settings.timeout',
          code: 'too_small'
        })
      ])
    });
  });

  // ============================================================================
  // validateRequest Function - Array Validation Tests
  // ============================================================================

  it('should handle array validation errors', () => {
    const bodySchema = z.object({
      tags: z.array(z.string().min(1)).min(1, 'At least one tag is required')
    });

    mockRequest.body = {
      tags: ['', 'valid-tag', '']
    };

    const middleware = validateRequest({ body: bodySchema });
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({
          field: 'body.tags.0',
          code: 'too_small'
        }),
        expect.objectContaining({
          field: 'body.tags.2',
          code: 'too_small'
        })
      ])
    });
  });

  // ============================================================================
  // Edge Cases and Error Handling Tests
  // ============================================================================

  it('should handle empty request object', () => {
    const bodySchema = z.object({
      name: z.string().optional()
    });

    mockRequest.body = undefined;

    const middleware = validateRequest({ body: bodySchema });
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({
          field: 'body',
          code: 'invalid_type'
        })
      ])
    });
  });

  it('should handle null request data', () => {
    const bodySchema = z.object({
      name: z.string()
    });

    mockRequest.body = null;

    const middleware = validateRequest({ body: bodySchema });
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({
          field: 'body',
          code: 'invalid_type'
        })
      ])
    });
  });

  it('should preserve original error codes and messages', () => {
    const bodySchema = z.object({
      email: z.string().email('Please provide a valid email address'),
      age: z.number().min(18, 'Must be at least 18 years old')
    });

    mockRequest.body = {
      email: 'not-an-email',
      age: 15
    };

    const middleware = validateRequest({ body: bodySchema });
    middleware(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: expect.arrayContaining([
        expect.objectContaining({
          field: 'body.email',
          message: 'Please provide a valid email address',
          code: 'invalid_format'
        }),
        expect.objectContaining({
          field: 'body.age',
          message: 'Must be at least 18 years old',
          code: 'too_small'
        })
      ])
    });
  });
});
