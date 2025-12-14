import request from 'supertest';
import express from 'express';

// Mock bcrypt BEFORE importing routes
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('$2b$12$hashedpassword'),
    compare: jest.fn(),
}));

// Mock Prisma
const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
};

jest.mock('../utils/prisma', () => ({
    __esModule: true,
    default: mockPrisma,
}));

// Mock JWT
jest.mock('../utils/jwt', () => ({
    generateToken: jest.fn().mockReturnValue('mock_jwt_token'),
    verifyToken: jest.fn(),
}));

import bcrypt from 'bcrypt';

describe('Authentication API', () => {
    let app: express.Application;

    beforeAll(async () => {
        // Import routes after mocks are set up
        const authRoutes = (await import('../routes/authRoutes')).default;

        app = express();
        app.use(express.json());
        app.use('/api/auth', authRoutes);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = {
                id: 'user123',
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockPrisma.user.create.mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!',
                    name: 'Test User',
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('test@example.com');
        });

        it('should return 409 if user already exists', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 'existing123',
                email: 'existing@example.com',
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'existing@example.com',
                    password: 'Password123!',
                    name: 'Existing User',
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
        });

        it('should return 400 for invalid email format', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'Password123!',
                    name: 'Test User',
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should return 400 for short password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: '123',
                    name: 'Test User',
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login user with correct credentials', async () => {
            const mockUser = {
                id: 'user123',
                email: 'test@example.com',
                password: '$2b$12$hashedpassword',
                name: 'Test User',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!',
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data).toHaveProperty('user');
        });

        it('should return 401 for incorrect password', async () => {
            const mockUser = {
                id: 'user123',
                email: 'test@example.com',
                password: '$2b$12$hashedpassword',
                name: 'Test User',
                role: 'USER',
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should return 401 for non-existent user', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Password123!',
                });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
