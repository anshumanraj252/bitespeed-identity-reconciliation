# Bitespeed Identity Reconciliation API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.x-orange)

A backend service for identity reconciliation that links customer contacts across multiple purchases.

## Features

- 🔗 Identity resolution across email/phone combinations
- 🏷️ Automatic primary/secondary contact linking
- 📦 REST API endpoint for contact identification
- 🛠️ Built with TypeScript and Prisma ORM
- 🐘 PostgreSQL database support


### Endpoint
**POST** `/identify`

#### Request Body
```json

**Database Schema**
prisma
model Contact {
  id              Int       @id @default(autoincrement())
  phoneNumber     String?  
  email           String?  
  linkedId        Int?     
  linkPrecedence  String   @default("primary")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime?
}

Setup Instructions
Prerequisites
Node.js 18+

PostgreSQL 15+

Git

Installation
Clone the repository:

bash
git clone https://github.com/anshumanraj252/bitespeed-identity-reconciliation.git
cd bitespeed-identity-reconciliation
Install dependencies:

bash
npm install
Set up environment variables:

bash
cp .env.example .env
Edit .env with your PostgreSQL credentials:

ini
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
Run database migrations:

bash
npx prisma migrate dev --name init
Start the development server:

bash
npm run dev
