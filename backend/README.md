# Tokyo Admin Dashboard - Backend

A Node.js/Express backend for the Tokyo Admin Dashboard with MongoDB, JWT authentication, and invoice management.

## Features

- JWT Authentication (register, login, token verification)
- Invoice Management (CRUD operations)
- MongoDB integration with Mongoose
- Password hashing with bcrypt
- Automatic invoice calculations
- Search and filtering capabilities

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

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

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with the environment variables above

3. Start MongoDB (make sure MongoDB is running on your system)

## Development

Start the development server:

```bash
npm run dev
```

## Production

Build the project:

```bash
npm run build
```
