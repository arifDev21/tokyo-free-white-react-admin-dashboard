# Tokyo Admin Dashboard - Backend

A Node.js/Express backend for the Tokyo Admin Dashboard with MongoDB, JWT authentication, and invoice management.

> **⚠️ Important**: Make sure you are in the `backend` folder before running any commands.

## 🚀 Quick Start

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env

# 4. Setup database (migration + seeder)
npm run db:setup

# 5. Start development server
npm run dev
```

### Alternative: Step by Step

1. **Navigate to backend folder**: `cd backend`
2. **Install dependencies**: `npm install`
3. **Setup environment**: `cp .env.example .env`
4. **Setup database**: `npm run db:setup`
5. **Start development server**: `npm run dev`

## 📋 Available Commands

### Database Commands

```bash
# Setup complete database (migration + seeder)
npm run db:setup

# Migration commands
npm run migrate              # Run all migrations
npm run migrate:rollback     # Rollback all migrations

# Seeder commands
npm run seed                 # Run all seeders
npm run seed:clear          # Clear all seeded data
```

### Development Commands

```bash
npm run dev                  # Start development server
npm run build               # Build for production
npm run start               # Start production server
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/tokyo-admin-dashboard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
```

## 🗄️ Database Structure

### Collections

#### Users Collection

```javascript
{
  _id: ObjectId,
  username: String (unique),
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Invoices Collection

```javascript
{
  _id: ObjectId,
  invoiceNo: String (unique),
  customerName: String,
  date: Date,
  dueDate: Date (optional),
  items: [{
    description: String,
    quantity: Number,
    price: Number,
    total: Number,
    isTaxable: Boolean,
    taxAmount: Number
  }],
  grandTotal: Number,
  isPosted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

- **Users**: `username` (unique), `createdAt` (descending)
- **Invoices**: `invoiceNo` (unique), `customerName`, `date` (descending), `isPosted`, `dueDate`, `createdAt` (descending)

## 👥 Sample Data

### Users

| Username | Password | Role  |
| -------- | -------- | ----- |
| admin    | admin123 | Admin |
| user1    | user123  | User  |
| demo     | demo123  | Demo  |

### Invoices

- **INV-001** - PT. ABC Company (Posted)
- **INV-002** - CV. XYZ Trading (Draft)
- **INV-003** - Toko Online Maju (Posted)
- **INV-004** - Restoran Sederhana (Draft)
- **INV-005** - Klinik Sehat (Draft)

## 🔄 Development Workflow

### Setup New Database

```bash
# 1. Setup environment
npm run setup

# 2. Setup database
npm run db:setup

# 3. Start server
npm run dev
```

### Reset Database

```bash
# Clear all data
npm run seed:clear

# Reseed data
npm run seed
```

### Schema Changes

```bash
# Rollback migration
npm run migrate:rollback

# Run new migration
npm run migrate
```

## 📁 File Structure

```
src/
├── migrations/
│   ├── index.ts                    # Migration runner
│   ├── 001-create-users.ts         # User migration
│   └── 002-create-invoices.ts     # Invoice migration
├── seeders/
│   ├── index.ts                    # Seeder runner
│   ├── 001-seed-users.ts          # User seeder
│   └── 002-seed-invoices.ts       # Invoice seeder
├── scripts/
│   ├── migrate.ts                  # Migration script
│   ├── seed.ts                    # Seeder script
│   └── setup-db.ts                # Complete setup script
├── models/
│   ├── User.ts                     # User model
│   └── Invoice.ts                  # Invoice model
├── controllers/
│   ├── authController.ts           # Authentication
│   └── invoiceController.ts        # Invoice management
├── services/
│   ├── authService.ts              # Auth business logic
│   └── invoiceService.ts           # Invoice business logic
├── repositories/
│   ├── userRepository.ts           # User data access
│   └── invoiceRepository.ts        # Invoice data access
├── middleware/
│   ├── authMiddleware.ts           # JWT authentication
│   └── responseFormatter.ts        # API response formatting
├── routes/
│   ├── auth.ts                     # Auth routes
│   └── invoice.ts                  # Invoice routes
└── server.ts                       # Main server file
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Model Already Exists Error

```bash
# Solution: Migration handles this with checks
# If still error, restart MongoDB
```

#### 2. Connection Error

```bash
# Make sure MongoDB is running
brew services start mongodb-community
# or
mongod
```

#### 3. Permission Error

```bash
# Make sure user has access to database
# Check MongoDB connection string
```

### Database Verification

```bash
# Connect to MongoDB
mongosh

# Use database
use tokyo-admin-dashboard

# Check collections
show collections

# Check users
db.users.find().pretty()

# Check invoices
db.invoices.find().pretty()
```

## 🚀 Production Notes

### Security

- Passwords hashed with bcrypt
- JWT secret must be changed in production
- MongoDB connection must be secure

### Performance

- Indexes optimized for common queries
- Schema validation active
- Timestamps for audit trail

### Monitoring

- Migration and seeder logs
- Complete error handling
- Rollback capability

## 📊 Features

- **JWT Authentication** (register, login, token verification)
- **Invoice Management** (CRUD operations)
- **MongoDB Integration** with Mongoose
- **Password Hashing** with bcrypt
- **Automatic Invoice Calculations** (tax, totals)
- **Search and Filtering** capabilities
- **Post/Unpost Invoice Status**
- **PDF Generation** support
- **Due Date Management**
- **Migration & Seeder System**

## 🔍 API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Invoices

- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `PUT /api/invoices/:id/status` - Update invoice status
- `GET /api/invoices/search` - Search invoices
- `GET /api/invoices/generate-number` - Generate invoice number
