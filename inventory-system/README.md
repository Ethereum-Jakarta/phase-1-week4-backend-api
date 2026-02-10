# Inventory System Usinng Express, Prisma, MySQL


## Install Depedencies

    npm install

## Run the app

    npm run dev

## API End Point

### AUTH Route

User Register : `POST /v1/auth/register`
User Login : `POST /v1/auth/login`
User Logout : `POST /v1/auth/logout`

### User Route

Get Users                    : `GET /v1/user/`
Get User By ID               : `GET /v1/user/:userId`
Update User By ID            : `PATCH /v1/user/:userId`
Delete User By ID            : `DELETE /v1/user/:userId`
Get Orders by UserId          : `GET /v1/user/:userId/orders`
Get Products by UserId        : `GET /v1/user/:userId/products`

### Category Route

Create Category              : `POST /v1/category`
Get Categorys                : `GET /v1/category`
Get Category by ID           : `GET /v1/category/:categoryId`
Update Category by ID        : `PATCH /v1/category/:categoryId`
Delete Category by ID        : `DELETE /v1/category:/categoryId`

### Product Route

Create Product                : `POST /v1/product`
Get Products                  : `GET /v1/product`
Get Product by ID             : `GET /v1/product/:productId`
Update Product by ID          : `PATCH /v1/product/:productId`
Delete Product by ID          : `DELETE /v1/product/:productId`

### Order Route

Create Order                  : `POST /v1/orders`
Get Orders                    : `GET /v1/orders`
Get Order by ID               : `GET /v1/orders/:orderId`
Update Order by ID            : `PATCH /v1/orders/:orderId`
Delete Product By ID          : `DELETE /v1/orders/:orderId`

### Order-Item Route

Create OrderItem              : `POST /v1/order-items`
Get OrderItem                 : `GET /v1/order-items`
Get OrderItem By ID           : `GET /v1/order-items/:orderItemId`
Update Order By ID            : `PATCH /v1/order-items/:orderItemId`
Delete Product By ID          : `DELETE /v1/order-items/:orderItemId`


