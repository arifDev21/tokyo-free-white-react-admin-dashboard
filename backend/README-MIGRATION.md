# Database Migration & Seeder

## Overview

Sistem migration dan seeder untuk mengelola struktur database dan data sample.

## Migration

Migration digunakan untuk mengelola perubahan struktur database (tabel, index, dll).

### Available Migrations

1. **001-create-users** - Membuat collection users dengan schema dan index
2. **002-create-invoices** - Membuat collection invoices dengan schema dan index

### Migration Commands

```bash
# Jalankan semua migration
npm run migrate

# Rollback semua migration
npm run migrate:rollback
```

### Migration Files

- `src/migrations/index.ts` - Migration runner
- `src/migrations/001-create-users.ts` - User migration
- `src/migrations/002-create-invoices.ts` - Invoice migration

## Seeder

Seeder digunakan untuk mengisi database dengan data sample.

### Available Seeders

1. **001-seed-users** - Membuat user sample (admin, user1, demo)
2. **002-seed-invoices** - Membuat invoice sample (5 invoice dengan data lengkap)

### Seeder Commands

```bash
# Jalankan semua seeder
npm run seed

# Clear semua data seeder
npm run seed:clear
```

### Seeder Files

- `src/seeders/index.ts` - Seeder runner
- `src/seeders/001-seed-users.ts` - User seeder
- `src/seeders/002-seed-invoices.ts` - Invoice seeder

## Setup Database

Untuk setup database lengkap (migration + seeder):

```bash
npm run db:setup
```

## Sample Data

### Users

- **admin** / admin123
- **user1** / user123
- **demo** / demo123

### Invoices

- 5 sample invoices dengan berbagai customer
- Data lengkap dengan items dan total
- Invoice numbers: INV-001 sampai INV-005

## File Structure

```
src/
├── migrations/
│   ├── index.ts
│   ├── 001-create-users.ts
│   └── 002-create-invoices.ts
├── seeders/
│   ├── index.ts
│   ├── 001-seed-users.ts
│   └── 002-seed-invoices.ts
└── scripts/
    ├── migrate.ts
    ├── seed.ts
    └── setup-db.ts
```

## Usage Examples

### Setup Database Baru

```bash
# 1. Setup environment
npm run setup

# 2. Setup database (migration + seeder)
npm run db:setup

# 3. Jalankan server
npm run dev
```

### Development Workflow

```bash
# Reset database
npm run seed:clear
npm run seed

# Rollback migration jika ada perubahan schema
npm run migrate:rollback
npm run migrate
```

## Environment Variables

Pastikan environment variables sudah diset:

```env
MONGODB_URI=mongodb://localhost:27017/tokyo-admin-dashboard
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
PORT=5001
```

## Troubleshooting

### Migration Error

- Pastikan MongoDB berjalan
- Check connection string di environment
- Pastikan tidak ada data yang conflict

### Seeder Error

- Pastikan migration sudah dijalankan
- Check apakah data sudah ada (seeder akan skip jika data sudah ada)
- Pastikan schema sesuai dengan model

### Database Connection

- Pastikan MongoDB service berjalan
- Check port MongoDB (default: 27017)
- Pastikan database name sesuai dengan MONGODB_URI
