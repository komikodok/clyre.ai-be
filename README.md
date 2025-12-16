# Clyre.ai Backend

Backend service for Clyre.ai, built with Express.js, TypeScript, and Prisma.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT & Bcrypt
- **AI Integration**: Langchain & Groq
- **Testing**: Jest & Supertest

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL Database
- npm or yarn

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clyre.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file and configure your variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   - `DATABASE_URL`: Your MySQL connection string
   - `JWT_SECRET_KEY`: Secret for token generation
   - `GROQ_API_KEY`: API key for AI features
   - `PORT`: Server port (default: 5000)

4. **Database Migration**
   Push the schema to your database:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

## 🏃‍♂️ Running the Application

**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

## 🧪 Testing

Run endpoints integration tests:
```bash
npm test
```

## 📚 API Documentation

Comprehensive API documentation is available in the `docs` directory.

- [🇬🇧 English Documentation](./docs/en/README.md)
- [🇮🇩 Dokumentasi Bahasa Indonesia](./docs/id/README.md)

**Quick Links:**
- [Authentication API](./docs/en/AUTH_API.md)
- [User API](./docs/en/USER_API.md)
- [Product API](./docs/en/PRODUCT_API.md)
- [Category API](./docs/en/CATEGORY_API.md)
- [Variant API](./docs/en/VARIANT_API.md)

## 📂 Project Structure

```
src/
├── api/            # App entry point and route aggregation
├── chains/         # Langchain AI chains
├── controllers/    # Request handlers
├── lib/            # Shared libraries (Prisma client, etc.)
├── middlewares/    # Express middlewares (Auth, Error, etc.)
├── routers/        # Route definitions
├── services/       # Business logic layer
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── validation/     # Zod validation schemas
tests/              # Integration tests
docs/               # API Documentation
```

## 🔐 Security

- All endpoints under `/api/products` (Write ops), `/api/users` (except public), and `/api/variants` are protected via JWT.
- Passwords are hashed using Bcrypt.
- Input validation is handled using Zod schemas.

## 📄 License

[MIT](LICENSE)
