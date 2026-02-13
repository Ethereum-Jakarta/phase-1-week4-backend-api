Inventory System API Documentation

#Authentication
POST /auth/register
Registers a new user.

POST /auth/login
Logs in an existing user.

#Category Endpoints
GET /category
Retrieves a list of all categories.

POST /category
Creates a new category.

GET /category/:categoryId
Retrieves a category.

PATCH /category/:categoryId
Updates an existing category.

DELETE /category/:categoryId
Deletes a category.

#Product Endpoints
GET /product
Retrieves a list of all products.

POST /product
Creates a new product.

GET /product/:productId
Retrieves a product.

PATCH /product/:productId
Updates an existing product.

DELETE /product/:productId
Deletes a product.

#Order Endpoints
GET /order
Retrieves a list of all orders.

POST /order
Creates a new order.

GET /order/:orderId
Retrieves a order.

PATCH /order/:orderId
Updates an existing order.

DELETE /order/:orderId
Deletes an order.

#Order Item Endpoints
GET /order-item
Retrieves a list of all order items.

POST /order-item
Creates a new order item.

GET /order-item/:orderItemId
Retrieves a order item.

PATCH /order-item/:orderItemId
Updates an existing order item.

DELETE /order-item/:orderItemId
Deletes an order item.

User Endpoints
GET /user
Retrieves user information.

POST /user
Creates a new user.

GET /user/:userId
Retrieves a user.

PATCH /user/:userId
Updates user information.

DELETE /user/:userId
Deletes a user.

Response Status Codes
200 OK
Successful request.

400 Bad Request
Invalid data.

401 Unauthorized
Authentication failed.

403 Forbidden
Insufficient permissions.

404 Not Found
Resource not found.

Authentication and Authorization
This API requires authentication.
Users with the role 'user' have access to CRUD operations for categories and products.
Users with the role 'admin' have access to all CRUD operations.

#Clone this repository
git clone https://github.com/ptrjs/inventory-system-api.git

cd inventory-system-api

#Installation
npm install

#Make .env file
PORT=3000
DATABASE_URL="your-db-url"
SECRET_KEY="your-secret-key"

#Running API
npm run dev
