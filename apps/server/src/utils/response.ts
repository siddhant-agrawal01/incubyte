import { Response } from 'express';
import { ApiResponse, ApiError } from 'shared-types';

export const sendSuccess = <T>(res: Response, data: T, statusCode: number = 200): Response => {
    const response: ApiResponse<T> = {
        success: true,
        data,
    };
    return res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    code: string,
    message: string,
    statusCode: number = 400,
    details?: any
): Response => {
    const error: ApiError = {
        code,
        message,
        ...(details && { details }),
    };
    const response: ApiResponse = {
        success: false,
        error,
    };
    return res.status(statusCode).json(response);
};

export const ErrorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    EMAIL_EXISTS: 'EMAIL_EXISTS',
} as const;
