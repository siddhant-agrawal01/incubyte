import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

export const createSweetSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(200, 'Name must be less than 200 characters'),
    category: z.string().min(2, 'Category must be at least 2 characters').max(100, 'Category must be less than 100 characters'),
    description: z.string().optional(),
    price: z.number().positive('Price must be positive').multipleOf(0.01, 'Price can have at most 2 decimal places'),
    quantity: z.number().int('Quantity must be an integer').nonnegative('Quantity cannot be negative'),
    imageUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

export const updateSweetSchema = createSweetSchema.partial();

export const purchaseSchema = z.object({
    quantity: z.number().int('Quantity must be an integer').positive('Quantity must be positive'),
});

export const restockSchema = z.object({
    quantity: z.number().int('Quantity must be an integer').positive('Quantity must be positive'),
});

export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export const sweetListQuerySchema = paginationSchema.extend({
    category: z.string().optional(),
    sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchQuerySchema = paginationSchema.extend({
    q: z.string().min(1, 'Search query is required'),
    category: z.string().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateSweetInput = z.infer<typeof createSweetSchema>;
export type UpdateSweetInput = z.infer<typeof updateSweetSchema>;
export type PurchaseInput = z.infer<typeof purchaseSchema>;
export type RestockInput = z.infer<typeof restockSchema>;
export type SweetListQuery = z.infer<typeof sweetListQuerySchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;