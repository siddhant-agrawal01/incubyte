import { ApiResponse, AuthResponse, SweetListResponse, SearchResponse, PurchaseResponse } from 'shared-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
    private token: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }
    }

    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    }

    /**
     * Build URLSearchParams from an object, filtering out undefined/null values.
     */
    private buildQueryParams(params: Record<string, string | number | undefined | null>): URLSearchParams {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        });
        return queryParams;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw data;
        }

        return data;
    }

    async register(email: string, password: string, name: string) {
        return this.request<{ user: any }>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    async login(email: string, password: string) {
        return this.request<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async getSweets(params?: {
        page?: number;
        limit?: number;
        category?: string;
        sortBy?: string;
        sortOrder?: string;
    }) {
        const queryParams = this.buildQueryParams({
            page: params?.page,
            limit: params?.limit,
            category: params?.category,
            sortBy: params?.sortBy,
            sortOrder: params?.sortOrder,
        });

        return this.request<SweetListResponse>(
            `/api/sweets?${queryParams.toString()}`
        );
    }

    async searchSweets(params: {
        q: string;
        page?: number;
        limit?: number;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
    }) {
        const queryParams = this.buildQueryParams({
            q: params.q,
            page: params.page,
            limit: params.limit,
            category: params.category,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
        });

        return this.request<SearchResponse>(
            `/api/sweets/search?${queryParams.toString()}`
        );
    }

    async createSweet(data: {
        name: string;
        category: string;
        description?: string;
        price: number;
        quantity: number;
        imageUrl?: string;
    }) {
        return this.request<{ sweet: any }>('/api/sweets', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateSweet(id: string, data: Partial<{
        name: string;
        category: string;
        description?: string;
        price: number;
        quantity: number;
        imageUrl?: string;
    }>) {
        return this.request<{ sweet: any }>(`/api/sweets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteSweet(id: string) {
        return this.request<{ message: string }>(`/api/sweets/${id}`, {
            method: 'DELETE',
        });
    }

    async purchaseSweet(id: string, quantity: number) {
        return this.request<PurchaseResponse>(`/api/sweets/${id}/purchase`, {
            method: 'POST',
            body: JSON.stringify({ quantity }),
        });
    }

    async restockSweet(id: string, quantity: number) {
        return this.request<{ sweet: any }>(`/api/sweets/${id}/restock`, {
            method: 'POST',
            body: JSON.stringify({ quantity }),
        });
    }
}

export const apiClient = new ApiClient();
