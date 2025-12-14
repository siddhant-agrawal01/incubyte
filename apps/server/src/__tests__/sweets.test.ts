import request from 'supertest';
import express from 'express';

// Mock auth middleware BEFORE importing routes
jest.mock('../middleware/auth', () => ({
    authenticate: jest.fn((req: any, res: any, next: any) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No token' } });
        }
        const token = authHeader.split(' ')[1];
        if (token === 'admin_token') {
            req.user = { userId: 'admin123', role: 'ADMIN' };
        } else {
            req.user = { userId: 'user123', role: 'USER' };
        }
        next();
    }),
    requireAdmin: jest.fn((req: any, res: any, next: any) => {
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Admin only' } });
        }
        next();
    }),
}));

// Mock Prisma
const mockPrisma = {
    sweet: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
    purchase: {
        create: jest.fn(),
    },
    $transaction: jest.fn(),
};

jest.mock('../utils/prisma', () => ({
    __esModule: true,
    default: mockPrisma,
}));

describe('Sweets API', () => {
    let app: express.Application;

    beforeAll(async () => {
        const sweetRoutes = (await import('../routes/sweetRoute')).default;

        app = express();
        app.use(express.json());
        app.use('/api/sweets', sweetRoutes);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/sweets', () => {
        it('should return list of sweets with pagination', async () => {
            const mockSweets = [
                {
                    id: 'sweet1',
                    name: 'Chocolate Truffle',
                    category: 'Chocolate',
                    price: 248.17,
                    quantity: 100,
                },
            ];

            mockPrisma.sweet.findMany.mockResolvedValue(mockSweets);
            mockPrisma.sweet.count.mockResolvedValue(1);

            const response = await request(app)
                .get('/api/sweets')
                .set('Authorization', 'Bearer user_token')
                .query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should return 401 without authentication', async () => {
            const response = await request(app).get('/api/sweets');
            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/sweets/:id/purchase', () => {
        it('should purchase a sweet successfully', async () => {
            mockPrisma.$transaction.mockImplementation(async (callback: any) => {
                return callback({
                    sweet: {
                        findUnique: jest.fn().mockResolvedValue({ id: 'sweet1', price: 248.17, quantity: 100 }),
                        update: jest.fn().mockResolvedValue({ id: 'sweet1', quantity: 99 }),
                    },
                    purchase: { create: jest.fn().mockResolvedValue({ id: 'p1' }) },
                });
            });

            const response = await request(app)
                .post('/api/sweets/sweet1/purchase')
                .set('Authorization', 'Bearer user_token')
                .send({ quantity: 1 });

            expect(response.status).toBe(200);
        });

        it('should return 404 for non-existent sweet', async () => {
            mockPrisma.$transaction.mockRejectedValue(new Error('NOT_FOUND'));

            const response = await request(app)
                .post('/api/sweets/nonexistent/purchase')
                .set('Authorization', 'Bearer user_token')
                .send({ quantity: 1 });

            expect(response.status).toBe(404);
        });

        it('should return 409 for insufficient stock', async () => {
            mockPrisma.$transaction.mockRejectedValue(new Error('OUT_OF_STOCK'));

            const response = await request(app)
                .post('/api/sweets/sweet1/purchase')
                .set('Authorization', 'Bearer user_token')
                .send({ quantity: 1 });

            expect(response.status).toBe(409);
        });
    });

    describe('POST /api/sweets (Admin only)', () => {
        it('should create a new sweet as admin', async () => {
            mockPrisma.sweet.create.mockResolvedValue({
                id: 'sweet2',
                name: 'New Sweet',
                category: 'Candy',
                price: 150,
                quantity: 50,
            });

            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', 'Bearer admin_token')
                .send({ name: 'New Sweet', category: 'Candy', price: 150, quantity: 50 });

            expect(response.status).toBe(201);
        });

        it('should return 403 for non-admin user', async () => {
            const response = await request(app)
                .post('/api/sweets')
                .set('Authorization', 'Bearer user_token')
                .send({ name: 'New Sweet', category: 'Candy', price: 150, quantity: 50 });

            expect(response.status).toBe(403);
        });
    });

    describe('PUT /api/sweets/:id (Admin only)', () => {
        it('should update a sweet as admin', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValue({ id: 'sweet1' });
            mockPrisma.sweet.update.mockResolvedValue({ id: 'sweet1', price: 300 });

            const response = await request(app)
                .put('/api/sweets/sweet1')
                .set('Authorization', 'Bearer admin_token')
                .send({ price: 300 });

            expect(response.status).toBe(200);
        });
    });

    describe('DELETE /api/sweets/:id (Admin only)', () => {
        it('should delete a sweet as admin', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValue({ id: 'sweet1' });
            mockPrisma.sweet.delete.mockResolvedValue({ id: 'sweet1' });

            const response = await request(app)
                .delete('/api/sweets/sweet1')
                .set('Authorization', 'Bearer admin_token');

            expect(response.status).toBe(200);
        });

        it('should return 404 when deleting non-existent sweet', async () => {
            mockPrisma.sweet.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/sweets/nonexistent')
                .set('Authorization', 'Bearer admin_token');

            expect(response.status).toBe(404);
        });
    });
});
