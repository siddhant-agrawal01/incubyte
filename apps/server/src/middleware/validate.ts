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
