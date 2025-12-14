#  Sweet Shop Management System Built using MonoRepo


## 🔗 Live Demo (https://incubyte-web.vercel.app/)

**[🌐 Deployed Application](https://incubyte-web.vercel.app/  )** 



## 📸 Screenshots
### Landing page
<img width="3072" height="1648" alt="Screenshot From 2025-12-15 00-00-33" src="https://github.com/user-attachments/assets/74e5ac9d-a06a-4ae6-aaaf-10e0d37ff9ad" />


### Dashboard
<img width="3072" height="1648" alt="Screenshot From 2025-12-15 00-00-51" src="https://github.com/user-attachments/assets/287988c6-bba7-459a-b5b9-1b2a50aa4e18" />



### admin management
<img width="3072" height="1648" alt="Screenshot From 2025-12-15 00-01-02" src="https://github.com/user-attachments/assets/41fe20ed-33c5-4986-a3ed-ae0a42bf2e2a" />








---

## 📖 Project Overview

### What is Sweet Shop?

Sweet Shop is a modern, full-stack e-commerce application designed for managing a sweet store. It features:



### Key Features

| Feature | Description |
|---------|-------------|
| User Registration | Create account with email validation |
| Secure Login | JWT-based authentication |
| Browse Sweets | View products with images, prices, stock |
| Search & Filter | Find sweets by name or category |
| Purchase | Buy sweets with stock tracking |
| Admin Panel | Add, edit, delete, restock products |
| Responsive Design | Works on desktop and mobile |

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** - Form management with Zod validation
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type-safe code
- **Prisma ORM** - Database management
- **Neon DB PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Shared Packages
- **validation** - Zod schemas for form validation
- **shared-types** - TypeScript interfaces

### DevOps
- **Turborepo** - Monorepo management
- **Jest** - Testing framework
- **Supertest** - API testing

---

## AI Usage

AI tools were used as a development aid in the following areas of this project:

- **Frontend UI Development**: Assisted in designing and refining UI components, layouts, and styling to improve usability and consistency.
- **Testing**: Helped in generating and refining test cases to ensure better coverage and reliability.
- **Search Functionality**: Assisted in designing and optimizing the search logic to improve accuracy and performance.

All core logic, architectural decisions, and final implementations were reviewed and validated manually to ensure correctness and maintainability.



## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher
- **npm** v9 or higher
- **PostgreSQL** database (or use NeonDB for cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sweet-shop.git
cd sweet-shop
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies for both frontend and backend (monorepo).

### 3. Set Up Environment Variables

#### Backend (`apps/server/.env`)

Create a `.env` file in `apps/server/`:

```env
# Database
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# JWT Secret (use a strong random string)
JWT_SECRET="your-super-secret-jwt-key-here"

# Server Port
PORT=3001
```

#### Frontend (`apps/web/.env`)

Create a `.env` file in `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Set Up Database

```bash
# Navigate to server directory
cd apps/server

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database with sample sweets
npx tsx prisma/seed.ts
```

### 5. Run the Application

#### Option A: Run Both (Recommended)

From the root directory:

```bash
npm run dev
```

This starts both frontend (port 3000) and backend (port 3001).

#### Option B: Run Separately

**Backend:**
```bash
cd apps/server
npm run dev
```

**Frontend:**
```bash
cd apps/web
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio** (DB GUI): `cd apps/server && npx prisma studio`

---

## 📁 Project Structure

```
sweet-shop/
├── apps/
│   ├── server/                 # Backend Express API
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database schema
│   │   │   └── seed.ts         # Sample data seeder
│   │   ├── src/
│   │   │   ├── controllers/    # Route handlers
│   │   │   ├── middleware/     # Auth, validation
│   │   │   ├── routes/         # API routes
│   │   │   ├── utils/          # Helpers, Prisma, JWT
│   │   │   └── __tests__/      # Jest tests
│   │   └── package.json
│   │
│   └── web/                    # Frontend Next.js App
│       ├── app/
│       │   ├── login/          # Login page
│       │   ├── register/       # Registration page
│       │   ├── dashboard/      # User dashboard
│       │   └── admin/          # Admin panel
│       ├── components/         # React components
│       ├── lib/                # API client, auth
│       └── package.json
│
├── packages/
│   ├── validation/             # Zod schemas
│   ├── shared-types/           # TypeScript types
│   └── ui/                     # Shared UI components
│
├── turbo.json                  # Turborepo config
└── package.json                # Root package.json
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Sweets

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/sweets` | Get all sweets | Yes |
| GET | `/api/sweets/search` | Search sweets | Yes |
| POST | `/api/sweets` | Create sweet | Admin |
| PUT | `/api/sweets/:id` | Update sweet | Admin |
| DELETE | `/api/sweets/:id` | Delete sweet | Admin |
| POST | `/api/sweets/:id/purchase` | Purchase sweet | Yes |
| POST | `/api/sweets/:id/restock` | Restock sweet | Admin |

---

## 🧪 Running Tests

```bash
# Run all tests
cd apps/server
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Results

```
Test Suites: 2 passed, 2 total
Tests:       17 passed, 17 total
Time:        0.98s
```

---

## 👤 User Roles

### Regular User
- Register/Login
- Browse sweets
- Search and filter
- Purchase sweets

### Admin User
- All regular user features
- Add new sweets
- Edit sweet details
- Delete sweets
- Restock inventory

---








## 👨‍💻 Author

**Siddhant Agrawal**

- GitHub: [@siddhant-agrawal01](https://github.com/siddhant-agrawal01)

---

