export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface Sweet {
    id: string;
    name: string;
    category: string;
    description?: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Purchase {
    id: string;
    userId: string;
    sweetId: string;
    quantity: number;
    price: number;
    createdAt: Date;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ApiError;
}

export interface ApiError {
    code: string;
    message: string;
    details?: any;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// export interface PaginatedResponse<T> {
//     items: T[];
//     pagination: PaginationMeta;
// }

// Auth Types
export interface AuthResponse {
    token: string;
    user: Omit<User, 'password'>;
}

export interface JwtPayload {
    userId: string;
    role: Role;
    iat?: number;
    exp?: number;
}

export interface SweetListResponse {
    sweets: Sweet[];
    pagination: PaginationMeta;
}

export interface SearchResponse {
    results: Sweet[];
    pagination: PaginationMeta;
}

export interface PurchaseResponse {
    purchase: Purchase;
    remainingStock: number;
}
