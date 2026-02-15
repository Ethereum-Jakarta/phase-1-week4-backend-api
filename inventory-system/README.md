# Inventory-System Backend API Documentation

**Description**

Welcome to the Inventory System Backend API documentation. This API serves as the backend for an inventory management system. There are two roles, user and admin. Role user can manages products and category, and role admin can manages users, orders and order-items efficiently. The API provides various endpoints to perform CRUD operations on products, orders, categories, and order-items.

**Base URL:**

```
http://localhost:3000/v1/api-endpoints 
```

## Authentication:

To use the application, first you must create an account, then you can login with the email and password you just created. You can also request to refresh the token and also logout. Endpoints:

1. **Register**
    - Endpoint URL: `/auth/register`
    - Description: This endpoint allows user to register and create a new account in the system. The default role is user.
    - Need a Bearer Token to access: `false`
    - HTTP Methods: 
        - `POST`: Create a new user
    - Request:
        - Body: 
            ```json
            {
                "email": "johndoe@example.com",
                "password": "johndoe123",
                "name": "John Doe",
            }
            ```
        - Not Null Fields:
            - `email`: Must be a valid email format, and make sure the email is not registered.
            - `password`: Must be at least 8 digits and must include letters and numbers.
            - `name`: Must be strings and not integer.
    - Response: 
        - Success:
            ```json
            {
                "status": 201,
                "message": "Create User Success",
                "data": {
                    "userCreated": {
                        "id": "d2e3c5d6-5d0f-4871-a4e7-ea7f40211671",
                        "name": "John Doe",
                        "email": "johndoe@example.com",
                        "password": "$2a$08$HtfLmNMSBx0tWwyDCtozEuszk3bWr5WtMX8NQFqdF.7EOGIO07nOK",
                        "role": "user",
                        "createdAt": "2024-04-17T12:21:27.778Z",
                        "updatedAt": "2024-04-17T12:21:27.778Z",
                        "isEmailVerified": false
                    },
                    "tokens": {
                        "access": {
                            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmUzYzVkNi01ZDBmLTQ4NzEtYTRlNy1lYTdmNDAyMTE2NzEiLCJpYXQiOjE3MTMzNTY0ODgsImV4cCI6MTcxMzM1ODI4OCwidHlwZSI6ImFjY2VzcyJ9.cZq-p8FavsBBlgK3Vjc1Qx-9nOo1u47R7ZACszw4mIY",
                            "expires": "2024-04-17T12:51:28.971Z"
                        },
                        "refresh": {
                            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmUzYzVkNi01ZDBmLTQ4NzEtYTRlNy1lYTdmNDAyMTE2NzEiLCJpYXQiOjE3MTMzNTY0ODgsImV4cCI6MTcxNTk0ODQ4OCwidHlwZSI6InJlZnJlc2gifQ.vsp-s2j8-_amWOZs1f7vxOZK8yLOKkaeXPgTXWyOWjw",
                            "expires": "2024-05-17T12:21:28.979Z"
                        }
                    }
                }
            }
            ```
        - Error
             ```json
            {
                "code": errorCode,
                "message": errorMessage,
                "stack": errorStack
            }
            ```

2. **Login**
    - Endpoint URL: `/auth/login`
    - Description: You can try logging in to start using the application on this endpoint.
    - Need a Bearer Token to access: `false`
    - HTTP Methods:
        - `POST`: Authenticate user credentials for login
    - Request: 
        - Body:
            ```json
            {
                "email": "johndoe@example.com",
                "password": "johndoe123",
            }
            ```
        - Not Null Fields:
            - `email`: Must be a valid email format, and make sure the email is registered.
            - `password`: Must be at least 8 digits and must include letters and numbers. Make sure this is a valid password for the email.
    - Response:
        - Success:
            ```json
            {
                "status": 200,
                "message": "Login Success",
                "data": {
                    "user": {
                        "id": "d2e3c5d6-5d0f-4871-a4e7-ea7f40211671",
                        "name": "John Doe",
                        "email": "johndoe@example.com",
                        "password": "$2a$08$HtfLmNMSBx0tWwyDCtozEuszk3bWr5WtMX8NQFqdF.7EOGIO07nOK",
                        "role": "user",
                        "createdAt": "2024-04-17T12:21:27.778Z",
                        "updatedAt": "2024-04-17T12:21:27.778Z",
                        "isEmailVerified": false
                    },
                    "tokens": {
                        "access": {
                            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmUzYzVkNi01ZDBmLTQ4NzEtYTRlNy1lYTdmNDAyMTE2NzEiLCJpYXQiOjE3MTMzNTk0OTQsImV4cCI6MTcxMzM2MTI5NCwidHlwZSI6ImFjY2VzcyJ9.IdqrZyuIGuIJ_IuWBThmIXyJFPthnTrtbfY1w2dncgA",
                            "expires": "2024-04-17T13:41:34.478Z"
                        },
                        "refresh": {
                            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmUzYzVkNi01ZDBmLTQ4NzEtYTRlNy1lYTdmNDAyMTE2NzEiLCJpYXQiOjE3MTMzNTk0OTQsImV4cCI6MTcxNTk1MTQ5NCwidHlwZSI6InJlZnJlc2gifQ.l19OZECmnX564SrXerTE3HtyoykXs_OWiOOYWjrjA8o",
                            "expires": "2024-05-17T13:11:34.479Z"
                        }
                    }
                }
            }
            ```
        - Error:
            ```json
            {
                "code": errorCode,
                "message": errorMessage,
                "stack": errorStack               
            }
            ```

3. **Refresh Token**
    - Endpoint URL: `/auth/refresh-token`
    - Description: You can refresh an expired JWT token by passing the JWT refresh token to request body on this endpoint.
    - Need a Bearer Token to access: `false`
    - HTTP Methods:
        - `POST`: Refresh the JWT token using the refresh token
    - Request:
        - Body:
            ```json
            {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmUzYzVkNi01ZDBmLTQ4NzEtYTRlNy1lYTdmNDAyMTE2NzEiLCJpYXQiOjE3MTMzNTk0OTQsImV4cCI6MTcxNTk1MTQ5NCwidHlwZSI6InJlZnJlc2gifQ.l19OZECmnX564SrXerTE3HtyoykXs_OWiOOYWjrjA8o"
            } 
            ```
        - Not Null Fields:
            - `token`: Make sure this is a valid JWT refresh token.  
    - Response:
        - Success: 
            ```json
            {
                "status": 200,
                "message": "Refresh Token Success",
                "data": {
                    "access": {
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmUzYzVkNi01ZDBmLTQ4NzEtYTRlNy1lYTdmNDAyMTE2NzEiLCJpYXQiOjE3MTMzNTk3NzcsImV4cCI6MTcxMzM2MTU3NywidHlwZSI6ImFjY2VzcyJ9.jIfy2C63eViycT5zsX1SIrlJ3ToAzprJqHjN3Zo16wU",
                        "expires": "2024-04-17T13:46:17.787Z"
                    },
                    "refresh": {
                        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMmUzYzVkNi01ZDBmLTQ4NzEtYTRlNy1lYTdmNDAyMTE2NzEiLCJpYXQiOjE3MTMzNTk3NzcsImV4cCI6MTcxNTk1MTc3NywidHlwZSI6InJlZnJlc2gifQ.t9bioKDqUqnOBwctG75I02oDqkUbCUo5WqdCqY-vAnI",
                        "expires": "2024-05-17T13:16:17.789Z"
                    }
                }
            }
            ```
        - Error:
            ```json
            {
                "code": errorCode,
                "message": errorMessage,
                "stack": errorStack                        
            }
            ````

4. **Logout**
    - Endpoint URL: `/auth/logout`
    - Description: Endpoint for deleting the JWT token in the database, even if the JWT token is deleted in the database, the JWT token can still be used until the access token expires.
    - Need a Bearer Token to access: `true`
    - HTTP Methods:
        - `POST`: Invalidate the JWT token in the database
    - Request:
        - Headers:
            ```json
                Bearer {JWTAccessToken}
            ```
        - Not Null Fields:
            - `Header Authorization`: Valid JWT access token.
    - Response:
        - Success:
            ```json
            {
                "status": 200,
                "mesage": "Logout Success",
                "data": null
            }
            ```
        - Error:
            ```json
            {
                "code": errorCode,
                "message": errorMessage,
                "stack": errorStack
            }              
            ```

## Authorization:

1. User
    - Role: `user`
    - Need a Bearer Token to access: `true`
    - HTTP Methods:
        - `POST`: 
            - URL: `/products`, `/categories`
        - `GET`: 
            - URL: `/products`, `/categories`
        - `PUT`:
            - URL: `/products`, `/categories` 
        - `DELETE`: 
            - URL: `/products`, `/categories`

2. Admin
    - Role: `admin`
    - Need a Bearer Token to access: `true`
    - HTTP Methods:
        - `POST`: 
            - URL: `/users`, `/categories`, `products`, `/orders`, `/order-items`
        - `GET`: 
            - URL: `/users`, `/categories`, `products`, `/orders`, `/order-items`
        - `PUT`:
            - URL: `/users`, `/categories`, `products`, `/orders`, `/order-items` 
        - `DELETE`: 
            - URL: `/users`, `/categories`, `products`, `/orders`, `/order-items`

## Endpoints:

1. Category:
    - URL: `/categories`
    - HTTP Methods:
        - `POST`: Create a new category
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTUserAccessToken}
                    ```
                - Body:
                    ```json
                    {
                        "name": "Laptop"
                    }
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Body`; Data sent in the request body.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 201,
                        "message": "Create Category Success",
                        "data": {
                            "id": "9dba7e9d-2da8-4abb-af15-0b9c58aa52cd",
                            "name": "Laptop",
                            "createdAt": "2024-04-20T09:14:33.921Z",
                            "updatedAt": "2024-04-20T09:14:33.921Z"
                        }
                    }
                    ```
            - Error:
                ```json
                {
                    "code": errorCode,
                    "message": errorMessage,
                    "stack": errorStack   
                }          
                ```   
        - `GET`: Get category by its id or get all categories
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTUserAccessToken}
                    ```
                - Parameters:
                    ```json
                        /categories/{categoryId}
                    ```
                - Queries:
                    - Valid queries: 
                        ```json
                        {
                            page: integer,
                            size: integer,
                            id: UUID,
                            name: string,
                            createdAt: date,
                            updatedAt: date,
                            orderBy: ['name:asc', 'name:desc']
                        }
                        ```
                    - Example:
                        ```json
                            /categories?page=1&limit=10&orderBy=name:asc
                        ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                - You Can Null This Fields:
                    - `Parameters`: Get spesific categoryId.
                    - `Queries`: Get spesific category by queries.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Get Category Success",
                        "data": [
                            {
                                "id": "9dba7e9d-2da8-4abb-af15-0b9c58aa52cd",
                                "name": "Laptop",
                                "createdAt": "2024-04-20T09:14:33.921Z",
                                "updatedAt": "2024-04-20T09:14:33.921Z"
                            }
                        ]
                    }
                    ```
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `PUT`: Update a category
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTUserAccessToken}
                    ```
                - Body:
                    ```json
                    {
                        "name": "newName"
                    }
                    ```
                - Parameters: 
                    ```json
                        /categories/{categoryId}
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Body`; Data sent in the request body.
                    - `Parameters`: Category id to update.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Update Category Success",
                        "data": {
                            "id": "9dba7e9d-2da8-4abb-af15-0b9c58aa52cd",
                            "name": "newName",
                            "createdAt": "2024-04-20T09:14:33.921Z",
                            "updatedAt": "2024-04-20T09:26:52.226Z"
                        }
                    }
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `DELETE`: Delete a category
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTUserAccessToken}
                    ```
                - Parameters:
                    ```json
                        /categories/{categoryId}
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Parameters`: Category id to delete.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Delete Category Success",
                        "data": null
                    }
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```

2. User:
    - URL; `/users`
    - HTTP Methods:
        - `POST`: Create a new user or admin
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Body:
                    ```json
                    {
                        "name": "John Doe",
                        "email": "johndoe@gmail.com",
                        "password": "johndoe123",
                        "role": "admin"
                    }
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Body`; Data sent in the request body.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 201,
                        "message": "Create User Success",
                        "data": {
                            "id": "cf5a9835-f627-44da-a586-730d6c04f797",
                            "name": "John Doe",
                            "email": "johndoe@gmail.com",
                            "password": "$2a$08$tIDkcYmD02a04XsodUcOYu15NRmafNavNIM6706JJn1TfD2CrZTLi",
                            "role": "admin",
                            "createdAt": "2024-04-20T09:46:38.610Z",
                            "updatedAt": "2024-04-20T09:46:38.610Z",
                            "isEmailVerified": false
                        }
                    }
                    ```
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `GET`: Get user by its id or get all users
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Parameters:
                    ```json
                        /users/{userId}
                    ```
                - Queries:
                    - Valid queries: 
                        ```json
                        {
                            page: integer,
                            size: integer,
                            name: string,
                            role: string,
                            orderBy: ['name:asc', 'name:desc', 'role:asc', 'role:desc']
                        }
                        ```
                    - Example:
                        ```json
                            /users?page=1&limit=10&orderBy=name:asc
                        ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                - You Can Null This Fields:
                    - `Parameters`: Get spesific productId.
                    - `Queries`: Get spesific product by queries.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Get User Success",
                        "data": [
                            {
                                "id": "d2e3c5d6-5d0f-4871-a4e7-ea7f40211671",
                                "name": "John Doe",
                                "email": "johndoe@gmail.com",
                                "password": "$2a$08$HtfLmNMSBx0tWwyDCtozEuszk3bWr5WtMX8NQFqdF.7EOGIO07nOK",
                                "role": "user",
                                "createdAt": "2024-04-17T12:21:27.778Z",
                                "updatedAt": "2024-04-17T12:21:27.778Z",
                                "isEmailVerified": false
                            }
                        ]
                    }
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `PUT`: Update a user
            - Need a Bearer Token to access: `true` 
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Body:
                    ```json
                    {
                        "name": "newName",
                        "email": "newEmail@gmail.com",
                        "password": "newPassword123",
                        "role": "admin"
                    }
                    ```
                - Parameters: 
                    ```json
                        /users/{userId}
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Body`; Data sent in the request body.
                    - `Parameters`: Category id to update.
            - Response:
                - Success:  
                    ```json
                    {
                        "status": 200,
                        "message": "Update User Success",
                        "data": {
                            "id": "d2e3c5d6-5d0f-4871-a4e7-ea7f40211671",
                            "name": "newName",
                            "email": "newEmail@gmail.com",
                            "password": "$2a$08$nvIvcjgC1PdnL72VI1LUjO6RTsh28UEvghokey0FXSeALg6/Y1HSi",
                            "role": "admin",
                            "createdAt": "2024-04-17T12:21:27.778Z",
                            "updatedAt": "2024-04-20T10:53:27.858Z",
                            "isEmailVerified": false
                        }
                    }
                    ```
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `DELETE`: Delete a user
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Parameters:
                    ```json
                        /users/{userId}
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Parameters`: User id to delete.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Delete User Success",
                        "data": null
                    }
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ``` 

3. Product:
    - URL: `/products`
    - HTTP Methods:
        - `POST`: Create a new product
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTUserAccessToken}
                    ```
                - Body:
                    ```json
                    {
                        "name": "Onixers Strada",
                        "description": "A backpack made of the best quality materials, strong and waterproof",
                        "price": 46.99,
                        "quantityInStock": 11,
                        "categoryId": "4fde5d95-b514-44a9-8617-cc445cf414c4",
                        "userId": "94cf7d8e-5e37-4653-ac34-204e2d428ab2"
                    }
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Body`; Data sent in the request body.
                - You Can Null This Fields:
                    - `Parameters`: Get spesific productId.
                    - `Queries`: Get spesific product by queries.
            - Response: 
                - Success: 
                    ```json
                    {
                        "status": 201,
                        "message": "Create Product Success",
                        "data": {
                            "id": "317a9bb1-9ae9-4a47-bb79-db13dd89ef0c",
                            "name": "Onixers Strada",
                            "description": "A backpack made of the best quality materials, strong and waterproof",
                            "price": 46.99,
                            "quantityInStock": 11,
                            "categoryId": "4fde5d95-b514-44a9-8617-cc445cf414c4",
                            "userId": "94cf7d8e-5e37-4653-ac34-204e2d428ab2",
                            "createdAt": "2024-04-20T09:14:33.921Z",
                            "updatedAt": "2024-04-20T09:14:33.921Z"
                        }
                    }
                    ```
                - Error: 
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `GET`: Get product by its id or get all products
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTUserAccessToken}
                    ```
                - Parameters:
                    ```json
                        /products/{productId}
                    ```
                 - Queries:
                    - Valid queries: 
                        ```json
                        {
                            page: integer,
                            size: integer,
                            name: string,
                            description: string,
                            price: integer,
                            quantityInStock: integer,
                            categoryId: UUID,
                            userId: UUID,
                            orderBy: ['name:asc', 'name:desc', 'description:asc', 'description:desc', 'price:asc', 'price:desc', 'quantityInStock:asc', 'quantityInStock:desc']
                        }
                        ```
                    - Example:
                        ```json
                            /categories?page=1&limit=10&orderBy=name:asc
                        ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                - You Can Null This Fields:
                    - `Parameters`: Get spesific productId.
                    - `Queries`: Get spesific product by queries.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Get Product Success",
                        "data": [
                            {
                                "id": "317a9bb1-9ae9-4a47-bb79-db13dd89ef0c",
                                "name": "Onixers Strada",
                                "description": "A backpack made of the best quality materials, strong and waterproof",
                                "price": 46.99,
                                "quantityInStock": 11,
                                "categoryId": "4fde5d95-b514-44a9-8617-cc445cf414c4",
                                "userId": "94cf7d8e-5e37-4653-ac34-204e2d428ab2",
                                "createdAt": "2024-03-25T01:40:15.099Z",
                                "updatedAt": "2024-03-30T16:07:28.914Z"
                            }
                        ]
                    }
                    ```
                - Error:
                    ```json
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack                        
                    ```
         - `PUT`: Update a product
            - Need a Bearer Token to access: `true` 
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTUserAccessToken}
                    ```
                - Body:
                    ```json
                    {
                        "name": "newName",
                        "description": "newDescription",
                        "price": 10,
                        "quantityInStock": 4,
                    }
                    ```
                - Parameters: 
                    ```json
                        /products/{productId}
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Body`; Data sent in the request body.
                    - `Parameters`: Product id to update.
            - Response:
                - Success:  
                    ```json
                    {
                        "status": 200,
                        "message": "Update Product Success",
                        "data": {
                            "id": "b78c337e-a7c5-4809-8217-068e8b14e1a1",
                            "name": "newName",
                            "description": "newDescription",
                            "price": 10,
                            "quantityInStock": 4,
                            "categoryId": "4fde5d95-b514-44a9-8617-cc445cf414c4",
                            "userId": "94cf7d8e-5e37-4653-ac34-204e2d428ab2",
                            "createdAt": "2024-04-20T09:39:35.105Z",
                            "updatedAt": "2024-04-20T11:21:06.798Z"
                        }
                    }
                    ```
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `DELETE`: Delete a products
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTUserAccessToken}
                    ```
                - Parameters:
                    ```json
                        /products/{productId}
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Parameters`: Product id to delete.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Delete Product Success",
                        "data": null
                    }
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ``` 

4. Order:
    - URL: `/orders`    
    - HTTP Methods:
        - `POST`: Create a new order
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Body:
                    ```json
                    {
                        "date": "2024-04-20 19:56:53",
                        "totalPrice": 0,
                        "customerName": "John Doe",
                        "customerEmail": "johndoe@gmail.com",
                        "userId": "cf5a9835-f627-44da-a586-730d6c04f797"
                    }
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Body`; Data sent in the request body.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 201,
                        "message": "Create Order Success",
                        "data": {
                            "id": "e66dac24-fd01-486f-9b5a-03e78796d472",
                            "date": "2024-04-20T11:58:35.000Z",
                            "totalPrice": 0,
                            "customerName": "John Doe",
                            "customerEmail": "johndoe@gmail.com",
                            "userId": "cf5a9835-f627-44da-a586-730d6c04f797",
                            "createdAt": "2024-04-20T11:59:09.511Z",
                            "updatedAt": "2024-04-20T11:59:09.511Z"
                        }
                    }
                    ```
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `GET`: Get order by its id or get all orders
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Parameters:
                    ```json
                        /orders/{orderId}
                    ```
                - Queries:
                    - Valid queries: 
                        ```json
                        {
                            page: integer,
                            size: integer,
                            date: date,
                            totalPrice: integer,
                            customerName: string,
                            customerEmail: string,
                            userId: UUID,
                            orderBy: ['date:asc', 'date:desc', 'totalPrice:asc', 'totalPrice:desc', 'customerName:asc', 'customerName:desc', 'customerEmail:asc', 'customerEmail:desc']
                        }
                        ```
                    - Example:
                        ```json
                            /orders?page=1&limit=10&orderBy=customerName:asc
                        ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                - You Can Null This Fields:
                    - `Parameters`: Get spesific orderId.
                    - `Queries`: Get spesific order by queries.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Get Order Success",
                        "data": [
                            {
                                "id": "e66dac24-fd01-486f-9b5a-03e78796d472",
                                "date": "2024-04-20T11:58:35.000Z",
                                "totalPrice": 0,
                                "customerName": "John Doe",
                                "customerEmail": "johndoe@gmail.com",
                                "userId": "cf5a9835-f627-44da-a586-730d6c04f797",
                                "createdAt": "2024-04-20T11:59:09.511Z",
                                "updatedAt": "2024-04-20T11:59:09.511Z"
                            }
                        ]
                    }
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `PUT`: Update an order
            - Need a Bearer Token to access: `true` 
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Body:
                    ```json
                    {
                        "totalPrice": 100,
                        "customerName": "newCustomerName",
                        "customerEmail": "newCustomerEmail@gmail.com"
                    }
                    ```
                - Parameters: 
                    ```json
                        /orders/{orderId}
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Body`; Data sent in the request body.
                    - `Parameters`: Order id to update.
            - Response:
                - Success:  
                    ```json
                    {
                        "status": 200,
                        "message": "Update Order Success",
                        "data": {
                            "id": "e66dac24-fd01-486f-9b5a-03e78796d472",
                            "date": "2024-04-20T11:58:35.000Z",
                            "totalPrice": 100,
                            "customerName": "newCustomerName",
                            "customerEmail": "newCustomerEmail@gmail.com",
                            "userId": "cf5a9835-f627-44da-a586-730d6c04f797",
                            "createdAt": "2024-04-20T11:59:09.511Z",
                            "updatedAt": "2024-04-20T12:05:27.155Z"
                        }
                    }
                    ```
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `DELETE`: Delete an order
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Parameters:
                    ```json
                        /orders/{orderId}
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Parameters`: Order id to delete.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Delete Order Success",
                        "data": null
                    }
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ``` 

5. OrderItem:
    - URL: `/order-items`
    - HTTP Methods:
        - `POST`: Create a new order-items
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Body:
                    ```json
                    {
                        "orderId": "e66dac24-fd01-486f-9b5a-03e78796d472",
                        "productId": "317a9bb1-9ae9-4a47-bb79-db13dd89ef0c",
                        "quantity": 1
                    }
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Body`; Data sent in the request body.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 201,
                        "message": "Create Order Item Success",
                        "data": {
                            "id": "73e9b950-b18c-49d6-86d2-c24771dc8770",
                            "orderId": "a1cccc15-4b0a-4ef6-9ddb-8da12a122d4e",
                            "productId": "317a9bb1-9ae9-4a47-bb79-db13dd89ef0c",
                            "quantity": 1,
                            "unitPrice": 46.99,
                            "createdAt": "2024-04-20T12:12:54.151Z",
                            "updatedAt": "2024-04-20T12:12:54.151Z"
                        }
                    }
                    ```
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `GET`: Get order-item by its id or get all order-items
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Parameters:
                    ```json
                        /order-items/{order-itemId}
                    ```
                - Queries:
                    - Valid queries: 
                        ```json
                        {
                            page: integer,
                            size: integer,
                            date: date,
                            orderId: UUID,
                            productId: UUID,
                            quantity: integer,
                            unitPrice: integer,
                            orderBy: [quantity:asc', 'quantity:desc', 'unitPrice:asc', 'unitPrice:desc']
                        }
                        ```
                    - Example:
                        ```json
                            /order-items?page=1&limit=10&orderBy=quantity:asc
                        ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                - You Can Null This Fields:
                    - `Parameters`: Get spesific order-itemId.
                    - `Queries`: Get spesific order-item by queries.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Get Order Success",
                        "data": [
                            {
                                "id": "73e9b950-b18c-49d6-86d2-c24771dc8770",
                                "orderId": "a1cccc15-4b0a-4ef6-9ddb-8da12a122d4e",
                                "productId": "317a9bb1-9ae9-4a47-bb79-db13dd89ef0c",
                                "quantity": 1,
                                "unitPrice": 46.99,
                                "createdAt": "2024-04-20T12:12:54.151Z",
                                "updatedAt": "2024-04-20T12:12:54.151Z"
                            }
                        ]
                    }
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `PUT`: Update an order-item
            - Need a Bearer Token to access: `true` 
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Body:
                    ```json
                    {
                        "quantity": 4
                    }
                    ```
                - Parameters: 
                    ```json
                        /order-items/{order-itemId}
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Body`; Data sent in the request body.
                    - `Parameters`: Order-item id to update.
            - Response:
                - Success:  
                    ```json
                    {
                        "status": 200,
                        "message": "Update Order Item Success",
                        "data": {
                            "id": "73e9b950-b18c-49d6-86d2-c24771dc8770",
                            "orderId": "a1cccc15-4b0a-4ef6-9ddb-8da12a122d4e",
                            "productId": "317a9bb1-9ae9-4a47-bb79-db13dd89ef0c",
                            "quantity": 4,
                            "unitPrice": 46.99,
                            "createdAt": "2024-04-20T12:12:54.151Z",
                            "updatedAt": "2024-04-20T12:17:29.075Z"
                        }
                    }
                    ```
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ```
        - `DELETE`: Delete an order-item
            - Need a Bearer Token to access: `true`
            - Request:
                - Headers:
                    ```json
                        Bearer {JWTAdminAccessToken}
                    ```
                - Parameters:
                    ```json
                        /order-items/{order-itemId}
                    ```
                - Not Null Fields:
                    - `Headers Authorization`: Valid JWT access token.
                    - `Parameters`: Order-item id to delete.
            - Response:
                - Success:
                    ```json
                    {
                        "status": 200,
                        "message": "Delete Order Item Success",
                        "data": null
                    }
                - Error:
                    ```json
                    {
                        "code": errorCode,
                        "message": errorMessage,
                        "stack": errorStack
                    }              
                    ``` 