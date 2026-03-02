## DIAGRAM RELATION

![inventory-diagram](public/inventory-diagram.png)

## API DOCS

### User API:

Create User:

```
POST -> /api/users
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

Get All Users:

```
GET -> /api/users?page=1
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "List users retrieved",
  "data": [
    {
      "id": 1,
      "name": "ayu",
      "phone": "0892348762342",
      "email": "ayunatalia@gmail.com"
    },
    {
      "id": 2,
      "name": "budi",
      "phone": "081234567890",
      "email": "budi@mail.com"
    }
  ]
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Bad Request"
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

Get User by ID:

```
GET -> /api/users/{userId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "User retrieved",
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
  "errors": { "userId": "User not found" }
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

Update User:

```
PUT -> /api/users/{userId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "name": "ayu updated",
  "phone": "0892348762342",
  "email": "ayunatalia@gmail.com"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "User updated",
  "data": {
    "id": 1,
    "name": "ayu updated",
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
  "errors": { "email": "Invalid email address" }
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

Delete User:

```
DELETE -> /api/users/{userId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "User deleted"
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Not Found",
  "errors": { "userId": "User not found" }
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

### Auth API:

User Login:

```
POST -> /api/auth/login
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "email": "ayunatalia@gmail.com",
  "password": "password123"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt-token>",
    "user": { "id": 1, "name": "ayu", "email": "ayunatalia@gmail.com" }
  }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Invalid credentials"
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

User Logout:

```
POST -> /api/auth/logout
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Logout successful"
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Invalid token"
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

User Register:

```
POST -> /api/auth/register
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "name": "ayu",
  "email": "ayunatalia@gmail.com",
  "password": "password123"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": { "id": 1, "name": "ayu", "email": "ayunatalia@gmail.com" }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": { "email": "Invalid email address" }
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

Refresh Token

```
POST -> /api/auth/refresh
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "succes": true,
  "message": "Succes generate new acces token!",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjNGVhYTY1LTJiOWItNDM0Yy1hMGZhLTYyNjkyZGI3ODg1MiIsIm5hbWUiOiJheXUgbmF0YWxpYSIsImVtYWlsIjoiYXl1bmF0YWxpYUBnbWFpbC5jb20iLCJpYXQiOjE3NzEzMzUzMzQsImV4cCI6MTc3MTMzNTkzNH0.Pm06tWb8QeADiH0qEpK0ZSb-nJVi-d4o9SJonAZKp-U"
  }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": { "email": "Invalid email address" }
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

### Product API:

Create Product:

```
POST -> /api/products
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "name": "Pensil",
  "price": 1200,
  "categoryId": 1,
  "userId": 1,
  "stock": 100
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Product created",
  "data": {
    "id": 1,
    "name": "Pensil",
    "price": 1200,
    "categoryId": 1,
    "userId": 1,
    "stock": 100
  }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": { "name": "Name is required" }
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

Get All Products:

```
GET -> /api/products
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Products retrieved",
  "data": [{ "id": 1, "name": "Pensil", "price": 1200, "stock": 100 }]
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Bad Request"
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

Get Product by ID:

```
GET -> /api/products/{productId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Product retrieved",
  "data": { "id": 1, "name": "Pensil", "price": 1200, "stock": 100 }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Not Found",
  "errors": { "productId": "Product not found" }
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

Update Product:

```
PATCH -> /api/products/{productId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "name": "Pensil 2B",
  "price": 1500,
  "stock": 90
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Product updated",
  "data": { "id": 1, "name": "Pensil 2B", "price": 1500, "stock": 90 }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": { "price": "Price must be a number" }
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

Delete Product:

```
DELETE -> /api/products/{productId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Product deleted"
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Not Found",
  "errors": { "productId": "Product not found" }
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

Get Products by User:

```
GET -> /api/users/{userId}/products
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Products for user retrieved",
  "data": [{ "id": 1, "name": "Pensil", "price": 1200, "stock": 100 }]
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": { "userId": "User ID is required" }
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

### Category API:

Create Category:

```
POST -> /api/categories
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "name": "Stationery"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Category created",
  "data": { "id": 1, "name": "Stationery" }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": { "name": "Name is required" }
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

Get All Categories:

```
GET -> /api/categories
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Categories retrieved",
  "data": [{ "id": 1, "name": "Stationery" }]
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Bad Request"
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

Get Category by ID:

```
GET -> /api/categories/{categoryId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Category retrieved",
  "data": { "id": 1, "name": "Stationery" }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Not Found",
  "errors": { "categoryId": "Category not found" }
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

Update Category:

```
PATCH -> /api/categories/{categoryId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "name": "Office Supplies"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Category updated",
  "data": { "id": 1, "name": "Office Supplies" }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": { "name": "Name is required" }
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

Delete Category:

```
DELETE -> /api/categories/{categoryId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Category deleted"
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Not Found",
  "errors": { "categoryId": "Category not found" }
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

### Order API:

Create Order:

```
POST -> /api/orders
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "userId": 1,
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ],
  "total": 3400
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Order created",
  "data": {
    "id": 1,
    "userId": 1,
    "total": 3400,
    "items": [
      { "productId": 1, "quantity": 2 },
      { "productId": 3, "quantity": 1 }
    ]
  }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": { "items": "Order must contain at least one item" }
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

Get All Orders:

```
GET -> /api/orders
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Orders retrieved",
  "data": [{ "id": 1, "userId": 1, "total": 3400 }]
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Bad Request"
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

Get Order by ID:

```
GET -> /api/orders/{orderId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Order retrieved",
  "data": {
    "id": 1,
    "userId": 1,
    "total": 3400,
    "items": [{ "productId": 1, "quantity": 2 }]
  }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Not Found",
  "errors": { "orderId": "Order not found" }
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

Update Order:

```
PUT -> /api/orders/{orderId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{
  "status": "shipped"
}
```

Response Success example:

```json
{
  "success": true,
  "message": "Order updated",
  "data": { "id": 1, "status": "shipped" }
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": { "status": "Invalid status" }
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

Delete Order:

```
DELETE -> /api/orders/{orderId}
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Order deleted"
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Not Found",
  "errors": { "orderId": "Order not found" }
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

Get Orders by User:

```
GET -> /api/users/{userId}/orders
```

<details>
<summary> Click for more details </summary>
Request Body example (json):

```json
{}
```

Response Success example:

```json
{
  "success": true,
  "message": "Orders retrieved",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "total": 3400,
      "items": [
        { "productId": 1, "quantity": 2 },
        { "productId": 3, "quantity": 1 }
      ]
    }
  ]
}
```

Response error example:

- 4xx Client Error

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": {
    "userId": "User ID is required"
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
