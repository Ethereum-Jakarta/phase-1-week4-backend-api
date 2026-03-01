# Inventory System - RPN


# API Documentation

This is the API documentation for a comprehensive system that allows you to manage users, categories, products, orders, and order items. The API is designed to facilitate the creation, retrieval, updating, and deletion of resources related to e-commerce functionality, including authentication.

## Base URL

All API requests should be made to the following base URL:

```
http://localhost:3000/api
```

## Authentication

All routes, except for authentication routes (`/auth/register`, `/auth/login`), require an **Authorization** header with a Bearer JWT token for authentication.

Example:

```bash
Authorization: Bearer <your-jwt-token>
```

### Register a New User

* **POST** `/auth/register`
  * Request body: `User` object
  * Response: `201` User registered successfully.

### Login a User

* **POST** `/auth/login`
  * Request body:
    ```json
    {
      "email": "user@example.com",
      "password": "your-password"
    }
    ```
  * Response: `200` User logged in successfully.

### Logout a User

* **POST** `/auth/logout`
  * Requires Bearer authentication.
  * Response: `200` User logged out successfully.

## API Endpoints

### Users

#### Create a New User

* **POST** `/users`
  * Request body: `User` object
  * Response: `201` User created successfully.

#### Get All Users

* **GET** `/users`
  * Response: `200` List of all users.

#### Get a User by ID

* **GET** `/users/{userId}`
  * Path parameter: `userId` (string)
  * Response: `200` User details.

#### Update a User

* **PUT** `/users/{userId}`
  * Path parameter: `userId` (string)
  * Request body: `User` object
  * Response: `200` User updated successfully.

#### Delete a User

* **DELETE** `/users/{userId}`
  * Path parameter: `userId` (string)
  * Response: `204` User deleted successfully.

### Categories

#### Create a Category

* **POST** `/categories`
  * Request body: `Category` object
  * Response: `201` Category created successfully.

#### Get All Categories

* **GET** `/categories`
  * Response: `200` List of all categories.

#### Get a Category by ID

* **GET** `/categories/{categoryId}`
  * Path parameter: `categoryId` (string)
  * Response: `200` Category details.

#### Update a Category

* **PUT** `/categories/{categoryId}`
  * Path parameter: `categoryId` (string)
  * Request body: `Category` object
  * Response: `200` Category updated successfully.

#### Delete a Category

* **DELETE** `/categories/{categoryId}`
  * Path parameter: `categoryId` (string)
  * Response: `204` Category deleted successfully.

### Products

#### Create a Product

* **POST** `/products`
  * Request body: `Product` object
  * Response: `201` Product created successfully.

#### Get All Products

* **GET** `/products`
  * Response: `200` List of all products.

#### Get a Product by ID

* **GET** `/products/{productId}`
  * Path parameter: `productId` (string)
  * Response: `200` Product details.

#### Update a Product

* **PUT** `/products/{productId}`
  * Path parameter: `productId` (string)
  * Request body: `Product` object
  * Response: `200` Product updated successfully.

#### Delete a Product

* **DELETE** `/products/{productId}`
  * Path parameter: `productId` (string)
  * Response: `204` Product deleted successfully.

#### Get Products by User ID

* **GET** `/users/{userId}/products`
  * Path parameter: `userId` (string)
  * Response: `200` List of products associated with the user.

### Orders

#### Create an Order

* **POST** `/orders`
  * Request body: `Order` object
  * Response: `201` Order created successfully.

#### Get All Orders

* **GET** `/orders`
  * Response: `200` List of all orders.

#### Get an Order by ID

* **GET** `/orders/{orderId}`
  * Path parameter: `orderId` (string)
  * Response: `200` Order details.

#### Update an Order

* **PUT** `/orders/{orderId}`
  * Path parameter: `orderId` (string)
  * Request body: `Order` object
  * Response: `200` Order updated successfully.

#### Delete an Order

* **DELETE** `/orders/{orderId}`
  * Path parameter: `orderId` (string)
  * Response: `204` Order deleted successfully.

#### Get Orders by User ID

* **GET** `/users/{userId}/orders`
  * Path parameter: `userId` (string)
  * Response: `200` List of orders associated with the user.

### Order Items

#### Create an Order Item

* **POST** `/order-items`
  * Request body: `OrderItem` object
  * Response: `201` Order item created successfully.

#### Get All Order Items

* **GET** `/order-items`
  * Response: `200` List of all order items.

#### Get an Order Item by ID

* **GET** `/order-items/{orderItemId}`
  * Path parameter: `orderItemId` (string)
  * Response: `200` Order item details.

#### Update an Order Item

* **PUT** `/order-items/{orderItemId}`
  * Path parameter: `orderItemId` (string)
  * Request body: `OrderItem` object
  * Response: `200` Order item updated successfully.

#### Delete an Order Item

* **DELETE** `/order-items/{orderItemId}`
  * Path parameter: `orderItemId` (string)
  * Response: `204` Order item deleted successfully.

#### Get Order Items by Order ID

* **GET** `/orders/{orderId}/order-items`
  * Path parameter: `orderId` (string)
  * Response: `200` List of order items associated with the order.

## Response Format

All responses are in JSON format. Successful operations return relevant data with HTTP status codes as follows:

* `201`: Resource successfully created.
* `200`: Request was successful, data returned.
* `204`: Resource successfully deleted.
