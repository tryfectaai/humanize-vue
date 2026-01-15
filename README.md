# Humanize Vue

A modern talent management platform connecting **Companies (Humanize accounts)** with **Talents (Human accounts)** in Kuwait/GCC for jobs, contests, and events.

## 🏗️ Architecture

This is a monorepo containing:

- **`frontend/`** - Vue 3 + TypeScript + Vite + TailwindCSS
- **`backend/`** - NestJS + TypeScript + Prisma ORM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MySQL 8.0
- pnpm (recommended) or npm

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma generate
npm run build
npm run start:dev
```

Backend runs on: http://localhost:3001
API Docs: http://localhost:3001/api/docs

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## 📁 Project Structure

```
humanize-vue/
├── frontend/                 # Vue 3 + TypeScript Frontend
│   ├── src/
│   │   ├── components/       # Reusable Vue components
│   │   ├── pages/            # Page components (routes)
│   │   ├── stores/           # Pinia state management
│   │   ├── services/         # API service functions
│   │   ├── types/            # TypeScript type definitions
│   │   ├── locales/          # i18n translations (en/ar)
│   │   └── utils/            # Utility functions
│   ├── public/
│   └── package.json
│
├── backend/                  # NestJS + TypeScript Backend
│   ├── src/
│   │   ├── modules/          # Feature modules (auth, human, company, etc.)
│   │   ├── common/           # Shared decorators, guards, pipes
│   │   ├── prisma/           # Prisma service
│   │   └── main.ts           # Application entry point
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
│
└── README.md
```

## 🔧 Tech Stack

### Frontend
- **Vue 3** - Composition API
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Pinia** - State management
- **Vue Router** - Routing
- **TailwindCSS** - Styling
- **Vue-i18n** - Internationalization (Arabic/English)
- **Axios** - HTTP client

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Swagger** - API documentation
- **Class-validator** - Request validation

## 🌐 Features

- **User Authentication** - Register, login, JWT tokens, social OAuth
- **Human Registration** - 5-step wizard for talent profiles
- **Company Registration** - 5-step wizard for company profiles
- **Jobs** - Post jobs, apply, manage applicants
- **Contests** - Create contests, participate, select winners
- **Events** - Create events, register attendees
- **Chat** - Real-time messaging (WebSocket)
- **Notifications** - In-app notifications
- **Payments** - KNPay integration with escrow
- **Bilingual** - Arabic/English with RTL support

## 📝 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/humanize

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# SMS Provider (MPP)
MPP_API_KEY=your-mpp-api-key
MPP_SENDER_NAME=humanize
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
```

## 🧪 Development

```bash
# Run backend in development mode
cd backend && npm run start:dev

# Run frontend in development mode  
cd frontend && npm run dev

# Run both simultaneously (from root)
npm run dev
```

## 📄 License

Private - All rights reserved.
