# Book Management System – NestJS + TypeORM

A simple RESTful API built using NestJS and TypeORM, supporting full CRUD operations for managing books and their authors.

---

### Features

- Author management (create, update, delete, list, search)
- Book management with author relationships
- SQLite for local development
- DTO validation using class-validator
- Centralized error handling
- Unit and end-to-end testing
- TypeORM-based migrations and data seeding

---

### Technologies Used

- NestJS – Progressive Node.js framework
- TypeORM – TypeScript ORM
- SQLite – Lightweight file-based SQL database (for development)
- Jest – Unit testing framework
- Supertest – E2E HTTP testing

---

### Getting Started

#### 1. Clone the Repository

```bash
git clone https://github.com/ArmAlam/book-management-nestjs
cd book-management-nestjs
```

#### 2. Install Dependencies
```bash
yarn 
```

#### 3. Environment Setup
```bash
cp env.example .env
```

#### 4. Run the Application
```bash
yarn start:dev
```

#### 5.Initialize the Database with Migrations and Seed Data
```bash
yarn db:init
```

### Running Tests
#### Unit Tests
```bash
yarn test
```

#### End-to-End Tests
```bash
yarn test:e2e
```

#### Why Use a SQL Database Instead of SQLite
SQLite is a great choice for local development and testing because it is file-based, lightweight, and requires no server setup. However, it is not ideal for production systems due to:

- Limited support for concurrent writes
- No built-in user access control
- No networked client/server architecture
- Limited scalability

#### I'll prefer Postgres for the project, becasue 
- PostgreSQL adheres closely to SQL standards, making queries and data model more portable and maintainable over time.
- Rich JSON/JSONB support for semi-structured data, Full-text search capabilities
- It'll maintain strong Relational Integrity to this project
- For features like partial matches on author names or filtering books by genre or publication date, PostgreSQL offers rich SQL capabilities and indexing strategies that keep queries performant at scale.
- When implementing features like cascading deletes (e.g., delete an author and their books), PostgreSQL ensures data consistency and rollback safety.
- PostgreSQL handles concurrent user operations more reliably than SQLite, which is single-writer and not designed for multi-user production workloads.