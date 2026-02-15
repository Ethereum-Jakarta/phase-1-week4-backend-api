# 🧾 Inventory System Project - API Documentation

Welcome to the API documentation for the **Inventory System** project! A project related to RPN Community.

This backend system is built with **Node.js**, **Express**, **Prisma**, and **MySQL**. It handles inventory and order management, with features like user authentication and more.

---


## 📚 Table of Contents

1. Features & Getting Started  
2. API Endpoints  
   2.1 Authentication  
   2.2 Users  
   2.3 Products  
   2.4 Categories  
   2.5 Orders  
   2.6 Order Items  
3. Middlewares  
4. Validation  
5. Error Handling  
6. Database Models  
   6.1 User  
   6.2 Token  
   6.3 Product  
   6.4 Category  
   6.5 Order  
   6.6 Order Item  
7. Database Relationships Diagram


---

## 📌 Features

- ✅ JWT-based Authentication
- 👤 User CRUD
- 📦 Product Management (per User)
- 📃 Order Management (per User)
- 🧰 Global Error Handling
- 🧪 Joi-based Validation
- 🔒 Auth Middleware

---

## 🚀 Getting Started

1. **Clone** the repository
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables** in `.env`:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/db_name"
   JWT_SECRET="your_jwt_secret"
   ```
4. **Run migrations**:
   ```bash
   npx prisma migrate dev
   ```
5. **Start server**:
   ```bash
   npm run dev
   ```

---

# 📦 API Endpoints
---

## 1. **Authentication Endpoints**

#### 🆕 `POST /api/auth/register`

Register a new user.

- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- ✅ **Success `201 Created`**
```json
{
  "status": 201,
  "message": "Register Success",
  "data": {
    "user": {
      "id": "userId123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR..."
    }
  },
  "error": null
}
```

- ❌ **Error `400 Bad Request`** (contoh email sudah terdaftar)
```json
{
  "status": 400,
  "message": "Email already registered",
  "error": null
}
```

---

#### 🔑 `POST /api/auth/login`

Login user.

- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Login Success",
  "data": {
    "user": {
      "id": "userId123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR..."
    }
  },
  "error": null
}
```

- ❌ **Error `401 Unauthorized`** (email/password salah)
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "error": null
}
```

---

#### 🔓 `POST /api/auth/logout`

Logout user (invalidate refresh token).

- **Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

- ✅ **Success `204 No Content`**
```json
{}
```

- ❌ **Error `400 Bad Request`** (refresh token tidak valid)
```json
{
  "status": 400,
  "message": "Invalid refresh token",
  "error": null
}
```

---

## 2. **User Endpoints**

#### `GET /api/users`

Fetch all users with pagination.

- **Query Parameters**:

  - `page`: (optional, default: 1)
  - `limit`: (optional, default: 10)

- ✅ Success `200 OK`

```json
{
  "status": 200,
  "message": "Get Users Success",
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
}
```

#### `GET /api/users/:userId`

Get a single user by ID.

- ✅ Success `200 OK`:

```json
{
  "status": 200,
  "message": "Get User Success",
  "data": {
    "id": "userId123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "error": null
}

```


#### `PATCH /api/users/:userId`

Update user data.

- **Body**:

```json
{
  "name": "New Name"
}
```

#### `DELETE /api/users/:userId`

Delete a user by ID.


---

## 3. **Product Endpoints**

#### 🆕 `POST /api/products`

Create a new product.

- **Headers**:
  - `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "Product name",
  "description": "A great product",
  "price": 100,
  "category": "electronics"
}
```

- ✅ **Success `201 Created`**
```json
{
  "status": 201,
  "message": "Create Product Success",
  "data": {
    "id": "productId123",
    "name": "Product name",
    "description": "A great product",
    "price": 100,
    "category": "electronics"
  },
  "error": null
}
```

- ❌ **Error `400 Bad Request`** – Validation Error
```json
{
  "status": 400,
  "message": "Validation Error",
  "data": null,
  "error": "Price must be a number"
}
```

---

#### 📄 `GET /api/products`

Get a list of all products with pagination and optional filters.

- **Headers**:
  - `Authorization: Bearer <token>`
- **Query Parameters (optional)**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
  - `search`: string (search in product name/description)
  - `category`: string

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Get Products Success",
  "data": [
    {
      "id": "productId123",
      "name": "Product name",
      "price": 100,
      "category": "electronics"
    },
    ...
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "totalPages": 5
  },
  "error": null
}
```

---

#### 🔍 `GET /api/products/:productId`

Get a product by its ID.

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Get Product Success",
  "data": {
    "id": "productId123",
    "name": "Product name",
    "price": 100,
    "category": "electronics"
  },
  "error": null
}
```

- ❌ **Error `404 Not Found`**
```json
{
  "status": 404,
  "message": "Product Not Found",
  "data": null,
  "error": null
}
```

---

#### ✏️ `PATCH /api/products/:productId`

Update an existing product.

- **Body**:
```json
{
  "name": "Updated name",
  "price": 150
}
```

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Update Product Success",
  "data": {
    "id": "productId123",
    "name": "Updated name",
    "price": 150
  },
  "error": null
}
```

- ❌ **Error `404 Not Found`**
```json
{
  "status": 404,
  "message": "Product Not Found",
  "data": null,
  "error": null
}
```

---

#### ❌ `DELETE /api/products/:productId`

Delete a product by ID.

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Delete Product Success",
  "data": null,
  "error": null
}
```

- ❌ **Error `404 Not Found`**
```json
{
  "status": 404,
  "message": "Product Not Found",
  "data": null,
  "error": null
}
```

---

#### 🎯 `GET /api/products/search?category=electronics`

Get products filtered by category.

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Get Product By Category Success",
  "data": [
    {
      "id": "productId123",
      "name": "Product name",
      "category": "electronics"
    },
    ...
  ],
  "error": null
}
```

- ❌ **Error `404 Not Found`** – No products found
```json
{
  "status": 404,
  "message": "No products found in this category",
  "data": null,
  "error": null
}
```


---

## 4. **Order Endpoints**

#### 🆕 `POST /api/orders`

Create a new order. *(admin only)*

- **Headers**:
  - `Authorization: Bearer <token>`
- **Body**:
```json
{
  "userId": "userId123",
  "totalPrice": 300,
  "status": "pending",
  "paymentMethod": "cash"
}
```

- ✅ **Success `201 Created`**
```json
{
  "status": 201,
  "message": "Order created successfully",
  "data": {
    "id": "orderId123",
    "userId": "userId123",
    "totalPrice": 300,
    "status": "pending",
    "paymentMethod": "cash"
  },
  "error": null
}
```

- ❌ **Error `400 Bad Request`**
```json
{
  "status": 400,
  "message": "Validation Error",
  "error": "Missing required field: totalPrice"
}
```

---

#### 📄 `GET /api/orders`

Fetch all orders. *(admin only)*

- **Headers**:
  - `Authorization: Bearer <token>`

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Get Orders Success",
  "data": [
    {
      "id": "orderId123",
      "userId": "userId123",
      "totalPrice": 300,
      "status": "pending"
    },
    ...
  ],
  "error": null
}
```

---

#### 🔍 `GET /api/orders/:orderId`

Get a specific order by ID. *(admin only)*

- **Headers**:
  - `Authorization: Bearer <token>`

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Get Order Success",
  "data": {
    "id": "orderId123",
    "userId": "userId123",
    "totalPrice": 300,
    "status": "pending"
  },
  "error": null
}
```

- ❌ **Error `404 Not Found`**
```json
{
  "status": 404,
  "message": "Order Not Found",
  "error": null
}
```

---

#### ✏️ `PATCH /api/orders/:orderId`

Update an existing order. *(admin only)*

- **Headers**:
  - `Authorization: Bearer <token>`
- **Body**:
```json
{
  "status": "completed"
}
```

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Update Order Success",
  "data": {
    "id": "orderId123",
    "status": "completed"
  },
  "error": null
}
```

---

#### ❌ `DELETE /api/orders/:orderId`

Delete an order by ID. *(admin only)*

- **Headers**:
  - `Authorization: Bearer <token>`

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Delete Order Success",
  "data": null,
  "error": null
}
```

---

#### 📦 `GET /api/orders/:orderId/order-items`

Get all order items belonging to a specific order. *(admin only)*

- **Headers**:
  - `Authorization: Bearer <token>`

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Get Order Items Success",
  "data": [
    {
      "id": "itemId123",
      "orderId": "orderId123",
      "productId": "productId123",
      "quantity": 2
    },
    ...
  ],
  "error": null
}
```

- ❌ **Error `404 Not Found`**
```json
{
  "status": 404,
  "message": "No order items found for this order",
  "error": null
}
```

---

## 5. **Order Item Endpoints**

#### 📄 `GET /api/order-items`

Fetch all order items. *(admin only)*

- **Headers**:
  - `Authorization: Bearer <token>`

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Get Order Items Success",
  "data": [
    {
      "id": "itemId123",
      "orderId": "orderId123",
      "productId": "productId123",
      "quantity": 2
    },
    ...
  ],
  "error": null
}
```

---

#### 🔍 `GET /api/order-items/:orderItemId`

Get a specific order item by ID. *(admin only)*

- **Headers**:
  - `Authorization: Bearer <token>`

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Get Order Item Success",
  "data": {
    "id": "itemId123",
    "orderId": "orderId123",
    "productId": "productId123",
    "quantity": 2
  },
  "error": null
}
```

- ❌ **Error `404 Not Found`**
```json
{
  "status": 404,
  "message": "Order Item Not Found",
  "error": null
}
```

---

#### ✏️ `PATCH /api/order-items/:orderItemId`

Update an order item. *(admin only)*

- **Headers**:
  - `Authorization: Bearer <token>`
- **Body**:
```json
{
  "quantity": 5
}
```

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Update Order Item Success",
  "data": {
    "id": "itemId123",
    "quantity": 5
  },
  "error": null
}
```

---

#### ❌ `DELETE /api/order-items/:orderItemId`

Delete an order item by ID. *(admin only)*

- **Headers**:
  - `Authorization: Bearer <token>`

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Delete Order Item Success",
  "data": null,
  "error": null
}
```

---  

## 6. **Category Endpoints**

#### 🆕 `POST /api/categories`

Create a new category. *(admin & user)*

- **Headers**:
  - `Authorization: Bearer <token>`

- **Body**:
```json
{
  "name": "Clothing"
}
```

- ✅ **Success `201 Created`**
```json
{
  "status": 201,
  "message": "Create Category Success",
  "data": {
    "id": "categoryId123",
    "name": "Clothing"
  },
  "error": null
}
```

---

#### 📄 `GET /api/categories`

Get all categories. *(admin & user)*

- **Headers**:
  - `Authorization: Bearer <token>`

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Get Categories Success",
  "data": [
    {
      "id": "categoryId123",
      "name": "Clothing"
    },
    ...
  ],
  "error": null
}
```

---

#### 🔍 `GET /api/categories/:categoryId`

Get a specific category by ID. *(admin & user)*

- **Headers**:
  - `Authorization: Bearer <token>`

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Get Category Success",
  "data": {
    "id": "categoryId123",
    "name": "Clothing"
  },
  "error": null
}
```

- ❌ **Error `404 Not Found`**
```json
{
  "status": 404,
  "message": "Category Not Found",
  "error": null
}
```

---

#### ✏️ `PATCH /api/categories/:categoryId`

Update a category. *(admin & user)*

- **Headers**:
  - `Authorization: Bearer <token>`

- **Body**:
```json
{
  "name": "Updated Name"
}
```

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Update Category Success",
  "data": {
    "id": "categoryId123",
    "name": "Updated Name"
  },
  "error": null
}
```

---

#### ❌ `DELETE /api/categories/:categoryId`

Delete a category by ID. *(admin & user)*

- **Headers**:
  - `Authorization: Bearer <token>`

- ✅ **Success `200 OK`**
```json
{
  "status": 200,
  "message": "Delete Category Success",
  "data": null,
  "error": null
}
```

---

# 🛡️ Middleware

Middleware functions are used to intercept and process requests before they reach the controller. Below are the middlewares used in this project:

## 🔐 `auth()`

Authenticates the user by verifying the JWT token.  
If valid, `req.user` will be populated with the user info.  
If invalid or missing, it returns `401 Unauthorized`.

- **Usage Example:**
```js
router.get('/protected', auth(), controller.handler);
```

---

## 🛂 `authorize(roles)`

Restricts access to specific roles (e.g. `admin`, `user`).  
If the authenticated user’s role is not permitted, returns `403 Forbidden`.

- **Usage Example:**
```js
router.post('/admin-action', auth(), authorize(['admin']), controller.handler);
```

---

## ✅ `validate(schema)`

Validates request inputs (body, query, params) using [Joi](https://joi.dev/).  
Returns `400 Bad Request` if validation fails, along with error details.

- **Usage Example:**
```js
router.post('/products', validate(productValidation.createProduct), productController.createProduct);
```

---

## 🧪 Validation with Joi

Each incoming request is validated using **Joi**, a powerful and flexible schema validator.

### ✅ Best Practices:

- Organize all validations inside the `/validations` directory.
- Group schemas by resource (e.g., `user.validation.js`, `product.validation.js`).
- Use the `validate()` middleware for **every endpoint** that accepts user input.

---

### 📦 Example: `createProduct` Schema

```js
const Joi = require('joi');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    price: Joi.number().required(),
    category: Joi.string().required(),
  }),
};
```

---

### 🙋 Example: `register` Schema

```js
const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};
```

---

# 🧯 Error Handling

This project includes centralized error handling middleware that ensures all errors are formatted consistently and logged properly, whether from HTTP requests, database (Prisma), or internal application logic.

---

### 🔄 `errorConverter(err, req, res, next)`

- Converts any unknown error (Axios, Prisma, etc.) into a standardized `ApiError` instance.
- Detects and handles:
  - Axios request errors
  - Prisma client errors
  - General server errors
- Passes the converted error to the `errorHandler`.

---

### 🚨 `errorHandler(err, req, res, next)`

- Final middleware that sends a structured error response.
- Automatically hides sensitive error stacks in **production mode**.
- Logs error details using Winston in **development mode**.

---

### 🧱 Prisma Error Handling

Handled automatically inside `errorConverter()`:

| Prisma Code | Meaning                        | HTTP Code | Message Example                              |
|-------------|--------------------------------|-----------|-----------------------------------------------|
| `P2002`     | Unique constraint failed       | `400`     | `Duplicate field value: email`                |
| `P2003`     | Foreign key constraint failed  | `400`     | `Invalid input data: orderId`                 |
| `P2014`     | Invalid relational ID          | `400`     | `Invalid ID: userId`                          |
| Other       | Unknown Prisma error           | `500`     | `Something went wrong: [Error Message]`       |

---

### 📦 Axios Error Handling

Axios errors from external HTTP requests are caught and converted like this:

```json
{
  "code": 404,
  "message": "Resource not found"
}
```

---

### 🧪 Example API Error Response

```json
{
  "code": 400,
  "message": "Duplicate field value: email"
}
```

### 🐛 Development Mode Response

```json
{
  "code": 500,
  "message": "Something went wrong",
  "stack": "at controller.js:14:12 ..."
}
```

---

### ✅ Best Practices

- Use `ApiError` to throw custom errors in controllers/services:
  ```js
  throw new ApiError(404, 'Product not found');
  ```
- Always `next(err)` in async error flows.
- Keep Prisma validation & constraint errors mapped for clarity.

---

# 📦 Database Models
This project uses **Prisma ORM** with a **MySQL** database. Below is an overview of all database models and their relationships.


### 🧑‍💼 User

Represents a registered user in the system.

| Field            | Type      | Description                        |
|------------------|-----------|------------------------------------|
| id               | String    | Primary key (UUID)                 |
| name             | String    | Full name                          |
| email            | String?   | Unique email address (optional)    |
| password         | String    | Hashed user password               |
| role             | String    | Role of the user (default: `user`) |
| isEmailVerified  | Boolean   | Email verification status          |
| createdAt        | DateTime  | Record creation timestamp          |
| updatedAt        | DateTime  | Last update timestamp              |

**Relations**:
- Has many `Product`
- Has many `Order`
- Has many `Token`

---

### 🔐 Token

Used for authentication purposes like access/refresh tokens.

| Field       | Type      | Description                         |
|-------------|-----------|-------------------------------------|
| id          | String    | Primary key (UUID)                  |
| token       | Text      | Token string                        |
| type        | String    | Token type (e.g., access, refresh)  |
| expires     | DateTime  | Token expiration date               |
| blacklisted | Boolean   | Whether token is invalidated        |
| createdAt   | DateTime  | Record creation timestamp           |
| updatedAt   | DateTime  | Last update timestamp               |

**Relations**:
- Belongs to `User`

---

### 🛍 Product

A product that can be added to an order.

| Field            | Type      | Description                        |
|------------------|-----------|------------------------------------|
| id               | String    | Primary key (UUID)                 |
| name             | String    | Product name                       |
| description      | String    | Description of the product         |
| price            | Float     | Product price                      |
| quantityInStock  | Int       | Stock available                    |
| createdAt        | DateTime  | Record creation timestamp          |
| updatedAt        | DateTime  | Last update timestamp              |

**Relations**:
- Belongs to `Category`
- Belongs to `User`
- Has many `OrderItem`

---

### 🗂 Category

Defines the product category.

| Field       | Type      | Description                        |
|-------------|-----------|------------------------------------|
| id          | String    | Primary key (UUID)                 |
| name        | String    | Category name                      |
| createdAt   | DateTime  | Record creation timestamp          |
| updatedAt   | DateTime  | Last update timestamp              |

**Relations**:
- Has many `Product`

---

### 📦 Order

Represents a customer's order.

| Field           | Type      | Description                       |
|------------------|-----------|-----------------------------------|
| id              | String    | Primary key (UUID)                |
| date            | DateTime  | Order date                        |
| totalPrice      | Float     | Total price of the order          |
| customerName    | String    | Name of the customer              |
| customerEmail   | String    | Email of the customer             |
| createdAt       | DateTime  | Record creation timestamp         |
| updatedAt       | DateTime  | Last update timestamp             |

**Relations**:
- Belongs to `User`
- Has many `OrderItem`

---

### 🧾 OrderItem

Represents each item inside an order.

| Field       | Type      | Description                      |
|-------------|-----------|----------------------------------|
| id          | String    | Primary key (UUID)               |
| quantity    | Int       | Number of units                  |
| unitPrice   | Float     | Price per unit                   |
| createdAt   | DateTime  | Record creation timestamp        |
| updatedAt   | DateTime  | Last update timestamp            |

**Relations**:
- Belongs to `Order`
- Belongs to `Product`

---

## 🔁 Relationships Diagram

```
User ──┬─< Token
       ├─< Product >─┬─ Category
       └─< Order >─┬─< OrderItem >─ Product
```

---

# 🧑‍💻 Author

Made with ❤️ by r3bel
