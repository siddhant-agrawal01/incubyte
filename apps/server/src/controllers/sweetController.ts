import { Response } from "express";
import prisma from "../utils/prisma";
import { sendSuccess, sendError, ErrorCodes } from "../utils/response";
import { AuthRequest } from "../middleware/auth";
import { CreateSweetInput, UpdateSweetInput, SweetListQuery } from "validation";

export const createSweet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const data = req.body as CreateSweetInput;

    const sweet = await prisma.sweet.create({
      data,
    });

    sendSuccess(res, { sweet }, 201);
  } catch (error) {
    console.error("Create sweet error:", error);
    sendError(res, ErrorCodes.INTERNAL_ERROR, "Failed to create sweet", 500);
  }
};

export const getSweets = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { page, limit, category, sortBy, sortOrder } =
      req.query as unknown as SweetListQuery;

    const where = category ? { category } : {};
    const orderBy = { [sortBy]: sortOrder };

    const [sweets, total] = await Promise.all([
      prisma.sweet.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sweet.count({ where }),
    ]);

    sendSuccess(res, {
      sweets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get sweets error:", error);
    sendError(res, ErrorCodes.INTERNAL_ERROR, "Failed to fetch sweets", 500);
  }
};

export const searchSweetsHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { q, category, minPrice, maxPrice, page, limit } = req.query as any;

    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;

    const [results, total] = await Promise.all([
      prisma.sweet.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { name: "asc" },
      }),
      prisma.sweet.count({ where }),
    ]);

    sendSuccess(res, {
      results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    sendError(res, ErrorCodes.INTERNAL_ERROR, "Search failed", 500);
  }
};

export const updateSweet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body as UpdateSweetInput;

    const existingSweet = await prisma.sweet.findUnique({ where: { id } });
    if (!existingSweet) {
      sendError(res, ErrorCodes.NOT_FOUND, "Sweet not found", 404);
      return;
    }

    const sweet = await prisma.sweet.update({
      where: { id },
      data,
    });

    sendSuccess(res, { sweet });
  } catch (error) {
    console.error("Update sweet error:", error);
    sendError(res, ErrorCodes.INTERNAL_ERROR, "Failed to update sweet", 500);
  }
};

export const deleteSweet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const sweet = await prisma.sweet.findUnique({ where: { id } });
    if (!sweet) {
      sendError(res, ErrorCodes.NOT_FOUND, "Sweet not found", 404);
      return;
    }

    await prisma.sweet.delete({ where: { id } });

    sendSuccess(res, { message: "Sweet deleted successfully" });
  } catch (error) {
    console.error("Delete sweet error:", error);
    sendError(res, ErrorCodes.INTERNAL_ERROR, "Failed to delete sweet", 500);
  }
};

export const purchaseSweet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user!.userId;

    const result = await prisma.$transaction(async (tx:any) => {
      const sweet = await tx.sweet.findUnique({
        where: { id },
      });

      if (!sweet) {
        throw new Error("NOT_FOUND");
      }

      if (sweet.quantity < quantity) {
        throw new Error("OUT_OF_STOCK");
      }

      const updatedSweet = await tx.sweet.update({
        where: { id },
        data: { quantity: sweet.quantity - quantity },
      });

      const purchase = await tx.purchase.create({
        data: {
          userId,
          sweetId: id,
          quantity,
          price: sweet.price,
        },
      });

      return {
        purchase,
        remainingStock: updatedSweet.quantity,
        sweet: updatedSweet,
      };
    });

    sendSuccess(res, {
      purchase: result.purchase,
      remainingStock: result.remainingStock,
    });
  } catch (error: any) {
    console.error("Purchase error:", error);
    if (error.message === "NOT_FOUND") {
      sendError(res, ErrorCodes.NOT_FOUND, "Sweet not found", 404);
    } else if (error.message === "OUT_OF_STOCK") {
      sendError(res, ErrorCodes.OUT_OF_STOCK, "Insufficient stock", 409);
    } else {
      sendError(res, ErrorCodes.INTERNAL_ERROR, "Purchase failed", 500);
    }
  }
};

export const restockSweet = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const sweet = await prisma.sweet.findUnique({ where: { id } });
    if (!sweet) {
      sendError(res, ErrorCodes.NOT_FOUND, "Sweet not found", 404);
      return;
    }

    const updatedSweet = await prisma.sweet.update({
      where: { id },
      data: { quantity: sweet.quantity + quantity },
    });

    sendSuccess(res, { sweet: updatedSweet });
  } catch (error) {
    console.error("Restock error:", error);
    sendError(res, ErrorCodes.INTERNAL_ERROR, "Restock failed", 500);
  }
};
