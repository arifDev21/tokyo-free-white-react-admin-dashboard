# Database Setup & Management

## 🚀 Quick Start

```bash
# Setup database lengkap (migration + seeder)
npm run db:setup

# Jalankan server
npm run dev
```

## 📋 Available Commands

### Migration Commands

```bash
# Jalankan semua migration
npm run migrate

# Rollback semua migration
npm run migrate:rollback
```

### Seeder Commands

```bash
# Jalankan semua seeder
npm run seed

# Clear semua data seeder
npm run seed:clear
```

### Database Setup

```bash
# Setup lengkap (migration + seeder)
npm run db:setup
```

## 🗄️ Database Structure

### Collections Created

#### 1. Users Collection

```javascript
{
  _id: ObjectId,
  username: String (unique),
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `username` (unique)
- `createdAt` (descending)

#### 2. Invoices Collection

```javascript
{
  _id: ObjectId,
  invoiceNo: String (unique),
  customerName: String,
  date: Date,
  items: [{
    description: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  grandTotal: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `invoiceNo` (unique)
- `customerName`
- `date` (descending)
- `createdAt` (descending)

## 👥 Sample Users

| Username | Password | Role  |
| -------- | -------- | ----- |
| admin    | admin123 | Admin |
| user1    | user123  | User  |
| demo     | demo123  | Demo  |

## 📄 Sample Invoices

### Invoice Data Created:

1. **INV-001** - PT. ABC Company (Rp 5,150,000)
2. **INV-002** - CV. XYZ Trading (Rp 10,000,000)
3. **INV-003** - Toko Online Maju (Rp 15,500,000)
4. **INV-004** - Restoran Sederhana (Rp 7,000,000)
5. **INV-005** - Klinik Sehat (Rp 18,500,000)

## 🔧 Development Workflow

### Setup Database Baru

```bash
# 1. Setup environment
npm run setup

# 2. Setup database
npm run db:setup

# 3. Jalankan server
npm run dev
```

### Reset Database

```bash
# Clear semua data
npm run seed:clear

# Seed ulang data
npm run seed
```

### Schema Changes

```bash
# Rollback migration
npm run migrate:rollback

# Jalankan migration baru
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
└── models/
    ├── User.ts                     # User model
    └── Invoice.ts                  # Invoice model
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Model Already Exists Error

```bash
# Solution: Migration sudah menangani ini dengan check
# Jika masih error, restart MongoDB
```

#### 2. Duplicate Index Warning

```bash
# Warning ini normal, tidak mempengaruhi fungsi
# Index sudah dibuat dengan benar
```

#### 3. Connection Error

```bash
# Pastikan MongoDB berjalan
brew services start mongodb-community
# atau
mongod
```

#### 4. Permission Error

```bash
# Pastikan user memiliki akses ke database
# Check MongoDB connection string
```

### Environment Variables

Pastikan file `.env` ada dengan konfigurasi:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tokyo-admin-dashboard
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

## 🔍 Database Verification

### Check Collections

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

### Check Indexes

```bash
# Check user indexes
db.users.getIndexes()

# Check invoice indexes
db.invoices.getIndexes()
```

## 📊 Data Statistics

Setelah setup, database akan memiliki:

- **3 Users** dengan password yang sudah di-hash
- **5 Invoices** dengan data lengkap
- **Proper Indexes** untuk performa optimal
- **Timestamps** untuk audit trail

## 🚀 Production Notes

### Security

- Password di-hash dengan bcrypt
- JWT secret harus diganti di production
- MongoDB connection harus secure

### Performance

- Index sudah dioptimasi untuk query umum
- Schema validation aktif
- Timestamps untuk audit

### Monitoring

- Log migration dan seeder
- Error handling lengkap
- Rollback capability
