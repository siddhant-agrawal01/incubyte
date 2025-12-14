import { Request, Response, NextFunction } from "express";

import { ZodSchema, ZodError, Schema } from "zod";
import { ErrorCodes, sendError } from "../utils/response";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      sendError(res, ErrorCodes.VALIDATION_ERROR, "validation failed", 400);
    }
  };
};



// This does two things at once:

//  Validates

// Ensures only correct data passes through

//  Sanitizes & normalizes

// Removes unexpected fields

// Converts types

// Enforces schema shape

// So after this line:

// req.query is trusted

// Controllers can use it safely
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      sendError(
        res,
        ErrorCodes.VALIDATION_ERROR,
        "Invalid query parameters",
        400
      );
    }
  };
};
