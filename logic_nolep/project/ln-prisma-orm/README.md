# FANCY TODO API

> Hola 🤓! FEX here, in this project i create basic RESTful API in Typescript with postgreSQL via PrismaORM Using expressjs as web server library to handle any HTTP Request.

---

## 🛠️ Features

- Create, edit, organize task
- Soft delete feature: It means when you delete task you're not actually delete it. Your task are moved into trash Directory, so in case you accidentaly delete your task you can also restore that task back in to the main task whenever you want. Task in trash also have expired date for next 30 day later, so be carefull and actively check your task in trash.

* \*NOTE: In this case i don't implement any authentication yet. So user input their id manually as parameter

---

## 🚀 Get Started

1. Fork this repo and clone this repo to your local directory

   ```bash
   git clone <your-forked-repo-url>
   cd ln-prisma-orm
   ```

2. Install all required dependencies

   ```bash
   npm install
   ```

3. Set up PostgreSQL database
   - Install PostgreSQL locally or create a free database on cloud services like Heroku, Neon, or Railway
   - Make sure you have the database credentials ready

4. Create `.env` file in the root directory and add your database connection URL

   ```env
   DATABASE_URL=postgres://username:password@localhost:5432/fancy_todo_db
   APP_PORT=3000
   ```

   **Note:** Replace `username`, `password`, `localhost`, and `fancy_todo_db` with your actual database credentials

5. Run Prisma migrations to set up database tables

   ```bash
   npx prisma migrate dev --name init
   ```

   This will execute the migration and generate the Prisma Client. For more details about the schema, check [prisma/schema.prisma](prisma/schema.prisma)

6. Start the development server

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:3000` (or your configured `APP_PORT`)

---

## 📚 Tech Stack

**Language**

- TypeScript, Prisma

**Runtime / Platform**

- Node.js `> v18+`

**Database**

- PostgreSQL via Prisma Orm

---

## 📦 Libraries Used

### Production Dependencies

| Library              | Description                 |
| -------------------- | --------------------------- |
| `@prisma/client`     | Prisma ORM Client           |
| `@prisma/adapter-pg` | Prisma PostgreSQL adapter   |
| `express`            | HTTP server framework       |
| `pg`                 | PostgreSQL driver           |
| `dotenv`             | Environment variable loader |
| `zod`                | Schema validation library   |

### Development Dependencies

| Library      | Description                 |
| ------------ | --------------------------- |
| `typescript` | TypeScript compiler         |
| `tsx`        | TypeScript runtime (dev)    |
| `prisma`     | Prisma ORM CLI              |
| `@types/*`   | TypeScript type definitions |

---

## 📁 Project Structure

```txt
.
├── src/
│   ├── application/
│   │   ├── prisma.ts          # Prisma client initialization
│   │   └── web.ts             # Express app setup
│   ├── controllers/            # Route handlers
│   │   ├── task.controller.ts
│   │   └── user.controller.ts
│   ├── services/               # Business logic
│   │   ├── task.service.ts
│   │   └── user.service.ts
│   ├── models/                 # Data models
│   ├── routes/                 # API route definitions
│   │   └── api.route.ts
│   ├── validations/            # Input validation schemas (Zod)
│   ├── middlewares/            # Express middlewares
│   ├── utils/                  # Helper utilities
│   ├── errors/                 # Error handling
│   └── index.ts                # Application entry point
├── prisma/
│   ├── schema.prisma           # Database schema definition
│   └── migrations/             # Database migration files
├── generated/
│   └── prisma/                 # Generated Prisma Client
├── .env                        # Environment variables (create this file)
├── .env.example                # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## DIAGRAM RELATION

![Fancy-todo-diagram](public/fancy-todo-erd.jpg)

## API DOCS

### USER: createUser

endpoint :

```
POST -> /todo/user/register
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "name": "ayu",
  "phone": "0892348762342",
  "email": "ayunatalia@gmail.com"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Selamat datang ayu, Kamu berhasil mendaftar!",
  "data": {
    "id": 1,
    "name": "ayu",
    "phone": "0892348762342",
    "email": "ayunatalia@gmail.com"
  }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "name": "Too small: expected string to have >=1 characters",
    "email": "Invalid email address"
  }
}
```

- 5xx Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

</details>

### USER: updateUser

endpoint :

```
PATCH -> /todo/user/:userId
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "name": "ayunda",
  "phone": "0892348762342",
  "email": "ayudanatalia@gmail.com"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Kamu berhasil mengubah data!",
  "data": {
    "id": 1,
    "name": "ayunda",
    "phone": "0892348762342",
    "email": "ayudanatalia@gmail.com"
  }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "name": "Too small: expected string to have >=1 characters",
    "email": "Invalid email address"
  }
}
```

- 5xx Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

</details>

### USER: deleteUser

endpoint :

```
DELETE -> /todo/user/:userId
```

<details>
<summary> Click for more details </summary>
Response Success example:

```json
{
  "success": true,
  "message": "User berhasil dihapus!",
  "data": {
    "id": 1,
    "name": "ayu",
    "phone": "0892348762342",
    "email": "ayunatalia@gmail.com"
  }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Not Found",
  "errors": {
    "id": "user dengan id: 6 tidak ditemukan!"
  }
}
```

- 5xx Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

</details>

---

### TASK: createTask

endpoint :

```
POST -> /todo/:userId/task
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "title": "membersihkan toilet",
  "description": "bersihkan toilet dengan sabun",
  "status": "active"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Task berhasil dibuat!",
  "data": {
    "id": 1,
    "title": "membersihkan toilet",
    "description": "bersihkan toilet dengan sabun",
    "status": "active"
  }
}
```

</details>

### TASK: updateTaskContent

endpoint :

```
PATCH -> /todo/:userId/task/:taskId/content
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "title": "membersihkan toilet",
  "description": "bersihkan toilet dengan sabun",
  "status": "completed"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Task berhasil diubah!",
  "data": {
    "id": 1,
    "title": "membersihkan toilet",
    "description": "bersihkan toilet dengan sabun",
    "status": "completed"
  }
}
```

</details>

### TASK: findAllTaskByUserId

endpoint :

```
GET -> /todo/:userId/task
```

<details>
<summary> Click for more details </summary>
Response Success example:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "membersihkan toilet",
      "status": "ACTIVE",
      "description": "bersihkan toilet dengan sabun",
      "category": ["pekerjaan rumah", ...]
    }
    ...
  ]
}
```

</details>

### TASK: findAllTaskByCategory

endpoint :

```
GET -> /todo/:userId/task/categories/:categoryId
```

<details>
<summary> Click for more details </summary>
Response Success example:

```json
{
  "success": true,
  "data": {
    "category_name": "pekerjaan rumah",
    "tasks": [
      {
        "id": 1,
        "title": "membersihkan toilet",
        "status": "active",
        "description": "bersihkan toilet dengan sabun"
      }
      ...
    ]
  }
}
```

</details>

### TASK: deleteTask

endpoint :

```
PATCH -> /todo/:userId/task/:taskId
```

---

### CATEGORY: createCategory

endpoint :

```
POST -> /todo/:userId/category
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "category_name": "pekerjaan rumah",
  "description": "kategori untuk pekerjaan rumah"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Category berhasil dibuat!",
  "data": {
    "id": 1,
    "category_name": "pekerjaan rumah",
    "description": "kategori untuk pekerjaan rumah"
  }
}
```

</details>

### CATEGORY: updateCategory

endpoint :

```
patch -> /todo/:userId/category
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "category_name": "pekerjaan rumah",
  "description": "kategori untuk pekerjaan rumah"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Category berhasil diperbarui!",
  "data": {
    "id": 1,
    "category_name": "pekerjaan rumah",
    "description": "kategori untuk pekerjaan rumah"
  }
}
```

</details>

### CATEGORY: findAllCategory

endpoint :

```
GET -> /todo/:userId/category/
```

<details>
<summary> Click for more details </summary>
Response Success example:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "category_name": "pekerjaan rumah",
      "description": "kategori untuk pekerjaan rumah"
    }
  ]
}
```

</details>

---

### TRASH: findAllTrash

endpoint :

```
GET -> /todo/:userId/trash/
```

<details>
<summary> Click for more details </summary>
Response Success example:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "membersihkan toilet",
      "status": "active",
      "description": "bersihkan toilet dengan sabun"
    }
  ]
}
```

</details>

### TRASH: restoreOneTrash

endpoint :

```
PATCH -> /todo/:userId/trash/:taskId
```

<details>
<summary> Click for more details </summary>
Response Success example:

```json
{
  "success": true,
  "message": "Task berhasil dipulihkan!"
}
```

</details>

### TRASH: deleteOneTrash

endpoint :

```
DELETE -> /todo/:userId/trash/:taskId
```

<details>
<summary> Click for more details </summary>
Response Success example:

```json
{
  "success": true,
  "message": "Task berhasil dihapus permanen!"
}
```

</details>

### TRASH: deleteAllTrash

endpoint :

```
DELETE -> /todo/:userId/trash/
```

<details>
<summary> Click for more details </summary>
Response Success example:

```json
{
  "success": true,
  "message": "Semua task di trash berhasil dihapus permanen!"
}
```

</details>
