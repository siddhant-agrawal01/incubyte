import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma";
import { generateToken } from "../utils/jwt";
import { sendSuccess, sendError, ErrorCodes } from "../utils/response";
import { RegisterInput, LoginInput } from "validation";
import { Role } from "shared-types";

const SALT_ROUNDS = 12;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body as RegisterInput;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      sendError(res, ErrorCodes.EMAIL_EXISTS, "Email already registered", 409);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: Role.USER,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    sendSuccess(res, { user }, 201);
  } catch (error) {
    console.error("Registration error:", error);
    sendError(res, ErrorCodes.INTERNAL_ERROR, "Registration failed", 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const isValidUser = user && (await bcrypt.compare(password, user.password));

    if (!isValidUser) {
      sendError(
        res,
        ErrorCodes.INVALID_CREDENTIALS,
        "Invalid email or password",
        401
      );
      return;
    }

    const token = generateToken({
      userId: user.id,
      role: user.role as Role,
    });

    const { password: _, ...userWithoutPassword } = user;

    sendSuccess(res, {
      token,
      user: userWithoutPassword,
    });



  } catch (error) {
    console.error("Login error:", error);

    sendError(res, ErrorCodes.INTERNAL_ERROR, "Login failed", 500);
  }
};
