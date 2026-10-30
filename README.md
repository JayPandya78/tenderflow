# TenderFlow

> A full-stack tender and procurement platform connecting organizations that publish opportunities with traders who submit quotations.

TenderFlow provides role-based organization and trader workspaces, tender and quotation management, PDF document sharing, and a React/TypeScript frontend backed by an Express API, MongoDB, and optional Redis caching. Docker Compose is available for containerized setup; separate auth, tender, and quotation services are included as an optional microservices architecture.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Docker Deployment](#docker-deployment)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Key Features & Workflows](#key-features--workflows)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

TenderFlow is a modern, enterprise-grade tender management platform that bridges the gap between organizations seeking services or products and traders/contractors willing to provide competitive bids. The platform facilitates a transparent, efficient bidding process with real-time notifications, secure authentication, and comprehensive tender tracking.

### Use Cases

- **Organizations** — Post procurement tenders, manage quotations, compare bids, award contracts.
- **Traders/Contractors** — Discover business opportunities, submit competitive quotations, track bid status.
- **Admins** — Monitor system activity, manage users, ensure compliance.

---

## Features

### For Organizations

- Create and publish tenders with detailed specifications
- Set deadlines and automatically track tender lifecycle
- Receive and manage quotations from multiple traders
- Compare quotations side-by-side
- Track tender status (OPEN, EVALUATION, AWARDED, CLOSED)
- Award contracts and notify winners
- Dashboard with tender analytics and insights
- Customizable notification preferences

### For Traders/Contractors

- Browse available tenders in real-time
- Filter tenders by category, deadline, and status
- Submit competitive quotations for tenders
- Track quotation submission status
- View bid history and performance metrics
- Manage professional profile
- Receive notifications on tender updates

### System-Wide

- JWT-based authentication with role-based access control
- Redis caching for performance optimization
- RESTful API with comprehensive endpoints
- MongoDB for flexible data storage
- Responsive UI with Tailwind CSS and Shadcn/ui
- Microservices architecture (optional)
- Docker containerization for easy deployment
- Real-time data synchronization

---

## Project Architecture

```
+-------------------------------------------------------------+
|                    FRONTEND (React + Vite)                  |
|              (Org Dashboard | Trader Dashboard)              |
+--------------------+----------------------------------------+
                     | (HTTP/REST)
+--------------------v----------------------------------------+
|              BACKEND API (Express.js)                        |
|  +--------------+  +-------------+  +--------------+       |
|  | Auth Routes  |  |Tender Routes|  |Quotation API |       |
|  +--------------+  +-------------+  +--------------+       |
+------------+---------------------------------+--------------+
             |                                 |
   +---------v--------+         +--------------v--------+
   |   MongoDB        |         |   Redis Cache         |
   |  (Primary Store) |         |  (Session/Cache)      |
   +------------------+         +-----------------------+

OPTIONAL MICROSERVICES LAYER:
  |- Auth Service (Authentication & Authorization)
  |- Tender Service (Tender Management)
  +- Quotation Service (Quotation Management)
```

---

## Technology Stack

### Frontend

| Layer | Technologies |
|-------|--------------|
| Framework | React 18.3.1 |
| Build Tool | Vite 5.4.19 |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS 3.4 + Shadcn/ui |
| State Management | React Query (TanStack Query) 5.83 |
| Routing | React Router DOM 6.30 |
| Forms | React Hook Form 7.61 + Zod validation |
| UI Components | Radix UI (Headless components) |
| Icons | Lucide React 0.462 |
| Testing | Vitest 3.2.4 |
| Charts | Recharts 2.15.4 |

### Backend

| Layer | Technologies |
|-------|--------------|
| Runtime | Node.js |
| Framework | Express.js 5.2.1 |
| Language | JavaScript (ES6+) |
| Database | MongoDB 9.2.1 (Mongoose) |
| Cache | Redis 5.11.0 |
| Authentication | JWT (jsonwebtoken 9.0.3) |
| Password Hashing | Bcrypt 6.0.0 |
| Middleware | CORS 2.8.6 |
| Environment | Dotenv 17.3.1 |

### DevOps

| Tool | Purpose |
|------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| Node | Runtime environment |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18+) and **npm** (v9+) or yarn
- **MongoDB** (v4.4+) — local or Atlas URI
- **Redis** (v6.0+) — for caching
- **Docker** and **Docker Compose** (optional, for containerized deployment)
- **Git**

### Quick Check

```bash
node --version    # Should be v18+
npm --version     # Should be v9+
docker --version  # Optional: Should be 20.10+
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/JayPandya78/tenderflow.git
cd tenderflow
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend-tenderflow
npm install
```

#### Create Environment File

```bash
cp .env.example .env
```

The example configuration uses local MongoDB and Redis. Replace `JWT_SECRET` with a strong, unique secret before deployment.

```env
# Server Configuration
BE_PORT=3000

# Database
DB_URI=mongodb://localhost:27017/tenderflow

# Redis Configuration
REDIS_URI=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# Environment
NODE_ENV=development
```

#### Verify MongoDB Connection

```bash
mongosh "mongodb://localhost:27017"
```

#### Verify Redis Connection

```bash
redis-cli ping
# Should return: PONG
```

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../tenderflow-pro
npm install
# or
bun install  # If using Bun package manager
```

#### Create Environment File

```bash
cp .env.example .env.local
```

### 4. Verify Installation

```bash
# Start the API in backend-tenderflow
npm run dev

# In a separate terminal, start the frontend in tenderflow-pro
npm run dev
```

Build and test the frontend from `tenderflow-pro`:

```bash
npm run build
npm test
```

---

## Project Structure

```
tenderflow/
├── backend-tenderflow/                 # Express.js Backend
│   ├── config/
│   │   ├── db.js                      # MongoDB connection
│   │   └── redis.js                   # Redis connection
│   ├── middleware/
│   │   ├── auth.js                    # JWT authentication middleware
│   │   ├── errorHandler.js            # Global error handler
│   │   └── role.js                    # Role-based access control
│   ├── models/
│   │   ├── User.js                    # User schema (ORG, TRADER, ADMIN)
│   │   ├── Tender.js                  # Tender schema
│   │   └── Quotation.js               # Quotation/Bid schema
│   ├── routes/
│   │   ├── auth.routes.js             # POST /register, /login, GET /me
│   │   ├── tender.routes.js           # CRUD operations for tenders
│   │   └── quotation.routes.js        # CRUD operations for quotations
│   ├── utils/
│   │   └── generateToken.js           # JWT token generation
│   ├── server.js                      # Express app initialization
│   ├── package.json
│   └── Dockerfile
│
├── microservices/                     # Optional Microservices (Scalable)
│   ├── auth-service/
│   ├── tender-service/
│   └── quotation-service/
│
├── tenderflow-pro/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                    # Shadcn UI components (50+)
│   │   │   ├── layouts/
│   │   │   │   ├── OrgSidebar.tsx
│   │   │   │   ├── TraderSidebar.tsx
│   │   │   │   └── TopNavbar.tsx
│   │   │   ├── org/
│   │   │   │   └── ComparisonModal.tsx
│   │   │   ├── trader/
│   │   │   │   └── SubmitQuotationModal.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── org/
│   │   │   │   ├── OrgDashboard.tsx
│   │   │   │   ├── CreateTender.tsx
│   │   │   │   ├── MyTenders.tsx
│   │   │   │   ├── TenderDetails.tsx
│   │   │   │   ├── QuotationsReceived.tsx
│   │   │   │   └── OrgSettings.tsx
│   │   │   ├── trader/
│   │   │   │   ├── TraderDashboard.tsx
│   │   │   │   ├── BrowseTenders.tsx
│   │   │   │   ├── TraderTenderDetails.tsx
│   │   │   │   ├── MyQuotations.tsx
│   │   │   │   └── TraderProfile.tsx
│   │   │   └── NotFound.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── hooks/
│   │   │   ├── use-toast.ts
│   │   │   └── use-mobile.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── data/
│   │   │   └── mockData.ts
│   │   ├── layouts/
│   │   │   ├── OrgLayout.tsx
│   │   │   └── TraderLayout.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## API Documentation

### Base URL

```
Local:      http://localhost:3000
Production: https://api.tenderflow.com
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "role": "ORG"   // OR "TRADER" or "ADMIN"
}

Response (201):
{
  "success": true,
  "message": "User created",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ORG",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "status": true,
  "message": "Login successfull",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { /* user object */ }
  }
}
```

#### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": { /* user object */ }
}
```

### Tender Endpoints

#### Create Tender (ORG only)

```http
POST /tender/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Website Development Project",
  "description": "Need modern responsive website",
  "category": "IT Services",
  "deadline": "2024-02-15T23:59:59Z"
}

Response (201):
{
  "success": true,
  "message": "Tender created successfully",
  "tender": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Website Development Project",
    "description": "Need modern responsive website",
    "category": "IT Services",
    "deadline": "2024-02-15T23:59:59Z",
    "organization": "507f1f77bcf86cd799439011",
    "status": "OPEN",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get All Tenders (with filters)

```http
GET /tender/all?status=OPEN&category=IT Services&page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "tenders": [ /* array of tenders */ ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

#### Get Tender by ID

```http
GET /tender/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "tender": { /* tender object with quotations */ }
}
```

#### Update Tender Status

```http
PATCH /tender/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "EVALUATION"  // OPEN, EVALUATION, AWARDED, CLOSED
}

Response (200):
{
  "success": true,
  "message": "Tender status updated",
  "tender": { /* updated tender */ }
}
```

#### Delete Tender

```http
DELETE /tender/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Tender deleted successfully"
}
```

### Quotation Endpoints

#### Submit Quotation (TRADER only)

```http
POST /quotation/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "tenderId": "507f1f77bcf86cd799439012",
  "amount": 50000,
  "description": "We offer high-quality development services",
  "deliveryDays": 45
}

Response (201):
{
  "success": true,
  "message": "Quotation submitted successfully",
  "quotation": {
    "_id": "507f1f77bcf86cd799439013",
    "tenderId": "507f1f77bcf86cd799439012",
    "trader": "507f1f77bcf86cd799439014",
    "amount": 50000,
    "description": "High-quality development",
    "deliveryDays": 45,
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Quotations for Tender

```http
GET /quotation/tender/:tenderId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "quotations": [ /* array of quotations */ ]
}
```

#### Get My Quotations (TRADER)

```http
GET /quotation/my-quotations
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "quotations": [ /* trader's quotations */ ]
}
```

#### Award Quotation (ORG only)

```http
PATCH /quotation/:id/award
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Quotation awarded successfully",
  "quotation": { /* updated quotation */ }
}
```

#### Reject Quotation

```http
PATCH /quotation/:id/reject
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Quotation rejected"
}
```

---

## Environment Variables

### Backend (.env)

```env
# Server
BE_PORT=3000
NODE_ENV=development

# Database
DB_URI=mongodb://localhost:27017/tenderflow

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)

```env
# API
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

---

## Running the Application

### Option 1: Local Development (Recommended)

**Terminal 1 — Start MongoDB**

```bash
# Local MongoDB
mongod

# OR via Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Terminal 2 — Start Redis**

```bash
# Local Redis
redis-server

# OR via Docker
docker run -d -p 6379:6379 --name redis redis:latest
```

**Terminal 3 — Start Backend**

```bash
cd backend-tenderflow
npm install
npm run dev
# Server running at http://localhost:3000
```

**Terminal 4 — Start Frontend**

```bash
cd tenderflow-pro
npm install
npm run dev
# Frontend running at http://localhost:5173
```

Open your browser at `http://localhost:5173`.

### Option 2: Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

Services will be available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- MongoDB: `localhost:27017`
- Redis: `localhost:6379`

### Option 3: Production Build

**Backend**

```bash
cd backend-tenderflow
npm install
npm start
```

**Frontend**

```bash
cd tenderflow-pro
npm install
npm run build
npm run preview
```

---

## Quotation PDF uploads

Organizations can optionally attach one PDF (up to 10 MB) when creating a tender; traders can view it on the tender details page. Traders can also optionally attach one PDF when submitting a quotation. The backend validates PDFs and stores tender documents in `backend-tenderflow/uploads/tenders` and quotation documents in `backend-tenderflow/uploads/quotations`. Keep these directories persistent when deploying the backend; the provided Docker Compose configuration mounts them from the host.

Tender PDFs are served to authenticated traders and the organization that owns the tender. Quotation PDFs are served only to the trader who submitted the quotation and the organization that owns its tender; organizations can view them from a tender's quotations or the Quotations Received page.

## Docker Deployment

### Build Custom Docker Images

```bash
# Build backend image
cd backend-tenderflow
docker build -t tenderflow-backend:1.0.0 .

# Build frontend image
cd ../tenderflow-pro
docker build -t tenderflow-frontend:1.0.0 .
```

The `docker-compose.yml` file covers the frontend, backend, MongoDB, and Redis services together.

### Deploy to Production

```bash
git pull origin main
docker-compose -f docker-compose.yml up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["ORG", "TRADER", "ADMIN"]),
  createdAt: Date,
  updatedAt: Date
}
```

### Tender Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  category: String,
  deadline: Date (required),
  organization: ObjectId (required, ref: User),
  status: String (enum: ["OPEN", "EVALUATION", "AWARDED", "CLOSED"], default: "OPEN"),
  createdAt: Date,
  updatedAt: Date
}
```

### Quotation Model

```javascript
{
  _id: ObjectId,
  tender: ObjectId (required, ref: Tender),
  trader: ObjectId (required, ref: User),
  amount: Number (required),
  description: String,
  deliveryDays: Number,
  status: String (enum: ["PENDING", "AWARDED", "REJECTED"], default: "PENDING"),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication & Authorization

### JWT Flow

1. User registers or logs in.
2. Backend generates a JWT token valid for 7 days.
3. Frontend stores the token in localStorage.
4. Token is sent via the `Authorization: Bearer <token>` header on every protected request.
5. Middleware validates the token before granting access.

### Role-Based Access Control (RBAC)

```
ORG (Organization)
  |- Create tenders
  |- View their own tenders
  |- Manage tender lifecycle
  +- Evaluate and award quotations

TRADER (Contractor/Supplier)
  |- Browse all open tenders
  |- Submit quotations
  |- View their own quotations
  +- Track bid status

ADMIN
  |- Manage all users
  |- Monitor system activity
  +- Generate reports
```

### Middleware Protection

Protected endpoints require a valid JWT token in the Authorization header, the correct user role checked by the role middleware, and ownership verification for resource-level access.

---

## Key Features & Workflows

### Tender Lifecycle

```
OPEN
  |  (Traders submit quotations)
EVALUATION
  |  (Organization reviews and compares)
AWARDED
  |  (Contract awarded to winner)
CLOSED
```

### Tender Submission Workflow (Organization)

1. Organization logs in.
2. Creates a tender with title, description, category, and deadline.
3. Tender is published as OPEN.
4. Traders can discover it in the browse view.
5. Organization reviews received quotations.
6. Organization compares quotations side-by-side.
7. Organization awards a quotation, updating the status to AWARDED.
8. Organization closes the tender.

### Quotation Submission Workflow (Trader)

1. Trader logs in.
2. Browses available OPEN tenders.
3. Filters by category, deadline, and other criteria.
4. Views tender details.
5. Submits a quotation with amount, description, and delivery days.
6. Quotation appears as PENDING.
7. Awaits the organization's decision.
8. Tracks all submissions under "My Quotations."

### Dashboard Highlights

**Organization Dashboard** shows total tenders created, active tenders, total quotations received, quotations pending review, and recently created tenders.

**Trader Dashboard** shows browsable tenders, submitted quotations, pending quotations, awarded quotations, and rejection rate.

---

## Development Guide

### Running Tests

```bash
# Frontend tests
cd tenderflow-pro
npm run test           # Run once
npm run test:watch     # Watch mode

# Backend tests
cd backend-tenderflow
npm run test           # Coming soon
```

### Code Style & Linting

```bash
cd tenderflow-pro
npm run lint

# Fix linting issues automatically
npx eslint . --fix
```

### Adding New Features

**Backend — New Route**
1. Create a controller in the appropriate file.
2. Add the route under `routes/`.
3. Add any required middleware.
4. Test with Postman or cURL.

**Frontend — New Page**
1. Create a component under `src/pages/`.
2. Register the route in `App.tsx`.
3. Add a sidebar link if needed.
4. Test navigation.

**Database — New Field**
1. Update the Mongoose schema in `models/`.
2. Write a migration script.
3. Update the relevant API endpoints.
4. Update any frontend forms consuming that field.

### Debug Mode

```bash
# Backend verbose logging
DEBUG=tenderflow:* npm start

# Frontend: open Chrome DevTools (F12) and use the Network tab to inspect API calls
```

---

## Troubleshooting

### MongoDB Connection Issues

```bash
mongosh

# If connecting remotely, update DB_URI in .env to your Atlas connection string
```

### Redis Connection Issues

```bash
redis-cli ping
# Should return: PONG

# Start Redis if not running
redis-server

# Or via Docker
docker run -d -p 6379:6379 redis:latest
```

### Port Already in Use

```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Find and kill process on port 5173
lsof -i :5173
kill -9 <PID>

# Alternatively, change the port in .env
```

### Token Expiration

Tokens expire after 7 days. The user needs to log in again to get a new one. A refresh token mechanism is planned for a future release.

### CORS Errors

Make sure `CORS_ORIGIN` in the backend `.env` matches your frontend URL exactly (e.g., `http://localhost:5173`). Restart the backend after making changes.

### Build Failures

```bash
rm -rf node_modules package-lock.json
npm install

# Clear npm cache if needed
npm cache clean --force
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes.
4. Write or update tests.
5. Commit with a meaningful message: `git commit -m 'Add your feature'`.
6. Push the branch: `git push origin feature/your-feature`.
7. Open a Pull Request.

### Code Standards

Follow the existing code style, write meaningful commit messages, add comments for complex logic, update the documentation, and test thoroughly before submitting a PR.

### Reporting Issues

Check existing issues before opening a new one. When filing a bug report, include a clear description, error messages and logs, reproduction steps, and your environment details (OS, Node version, etc.).

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Authors & Acknowledgments

Built by the TenderFlow team, open to community contributions.

Thanks to the React and Vite teams, the Shadcn/ui project, the Express.js community, and the Tailwind CSS team.

---

## Roadmap

Planned for v2.0:

- Email notifications for tender updates
- SMS alerts for urgent deadlines
- Payment gateway integration
- Digital signature for contracts
- Analytics and reporting dashboard
- Bulk tender import/export
- Mobile app (iOS and Android)
- Microservices deployment guide
- API versioning (v2)
- GraphQL support
- Real-time chat between organizations and traders
- Document storage and management
- Compliance tracking and audit logs

---

## Support & Contact

- **Email**: support@tenderflow.com
- **Documentation**: https://docs.tenderflow.com
- **Issues**: https://github.com/tenderflow/issues
- **Discussions**: https://github.com/tenderflow/discussions

---

## Quick Start Reference

```bash
# Clone
git clone https://github.com/tenderflow/tenderflow.git && cd tenderflow

# Backend
cd backend-tenderflow && npm install && npm run dev

# Frontend (new terminal)
cd tenderflow-pro && npm install && npm run dev

# Access
# Frontend: http://localhost:5173
# API:      http://localhost:3000

# Test accounts
# Org:    org@example.com / password
# Trader: trader@example.com / password
```
