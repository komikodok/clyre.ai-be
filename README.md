# clyre.ai (Backend)

Backend API (Express + TypeScript) untuk autentikasi, manajemen user, topik, dan agent AI (LangChain + LangGraph). Project ini juga mendukung upload dokumen per-topik untuk kebutuhan retrieval (MongoDB Atlas Vector Search) dan konsultasi/streaming jawaban dari model (Groq).

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **AI**:
  - LangChain, LangGraph
  - Groq (LLM via `@langchain/groq`)
  - HuggingFace Inference Embeddings (vector embedding)
  - MongoDB Atlas Vector Search (`@langchain/mongodb`)
- **File upload**: Multer + Cloudinary
- **Testing**: Jest + Supertest
- **Logging**: Winston

## Menjalankan Project

### 1) Install dependencies

```bash
npm install
```

### 2) Set environment variables

Buat file `.env` di root project.

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

# Auth
JWT_SECRET_KEY=your-secret

# LLM (Groq)
GROQ_API_KEY=your-groq-key
MODEL_NAME=llama-3.3-70b-versatile

# Embeddings (HuggingFace)
HUGGINGFACEHUB_API_KEY=your-hf-key

# Cloudinary (upload dokumen)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 3) Run (dev)

```bash
npm run dev
```

Server akan jalan di `http://localhost:5000` dengan base path API: `http://localhost:5000/api`.

### 4) Build & start

```bash
npm run build
npm start
```

## Scripts

- **`npm run dev`**: jalankan server dengan watch (`tsx watch src/api/server.ts`)
- **`npm run build`**: compile TypeScript ke folder `dist`
- **`npm start`**: jalankan hasil build (`node dist/api/server.js`)
- **`npm test`**: jalankan test Jest
- **`npm run test:watch`**: jalankan test dalam mode watch

## API Overview

Base URL: `/api`

### Auth

- **POST** `/api/auth/register`
- **POST** `/api/auth/login`

### Users

- **GET** `/api/users` (public)
- **GET** `/api/users/profile` (auth)
- **GET** `/api/users/:id` (auth)
- **PUT** `/api/users/:id` (auth)

### Topics

- **GET** `/api/topics`
- **POST** `/api/topics`
- **DELETE** `/api/topics/:id`

### Agents (auth required)

- **POST** `/api/agents/new`
- **POST** `/api/agents/consult/:topic`
- **POST** `/api/agents/stream/:topic`

#### Upload docs per topic

- **POST** `/api/agents/docs/:topic`
  - `multipart/form-data`
  - field file: `document`

## Catatan Teknis

- **CORS** saat ini mengizinkan origin:
  - `http://localhost:5000`
  - `http://localhost:3000`
- **Vector store** dokumen disimpan per topik ke collection MongoDB dengan nama: `${topic}_docs`.

## Disclaimer

Project ini menyediakan informasi berbasis AI. Gunakan sebagai bantuan, bukan pengganti keputusan profesional.
