# Inventory System API Documentation

## Deskripsi
API Inventory System adalah sebuah sistem yang memungkinkan pengguna untuk mengelola pengguna, kategori, produk, pesanan, dan item pesanan. API ini mendukung operasi CRUD (Create, Read, Update, Delete) dan menggunakan otentikasi JWT untuk melindungi endpoint yang sensitif.

---

## Daftar Endpoint

### Auth
- Registrasi Pengguna Baru
- Login Pengguna

### Pengguna
- Mendapatkan Semua Pengguna
- Mendapatkan Pengguna Berdasarkan ID
- Memperbarui Pengguna
- Menghapus Pengguna

### Kategori
- Membuat Kategori Baru
- Mendapatkan Semua Kategori
- Mendapatkan Kategori Berdasarkan ID
- Memperbarui Kategori
- Menghapus Kategori

### Produk
- Membuat Produk Baru
- Mendapatkan Semua Produk
- Mendapatkan Produk Berdasarkan ID
- Memperbarui Produk
- Menghapus Produk

### Pesanan
- Membuat Order Baru
- Mendapatkan Semua Pesanan
- Mendapatkan Order Berdasarkan ID
- Memperbarui Order
- Menghapus Order

### Item Pesanan
- Membuat Item Pesanan Baru

---

## Auth

### Registrasi Pengguna Baru
**Endpoint**: `POST /api/auth/register`

**Input**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Response:**

- 200 OK:

```json
{
  "user": {
    "id": "integer",
    "name": "string",
    "email": "string"
  },
  "token": "string"
}
```
- **500 Internal Server Error**:

```json
{
  "message": "Error message"
}
```
**Login Pengguna**
**Endpoint**: POST /api/auth/login

**Input**:

```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**

- 200 OK:

```json
{
  "user": {
    "id": "integer",
    "name": "string",
    "email": "string"
  },
  "token": "string"
}
```
- 401 Unauthorized:

```json
{
  "message": "Invalid credentials"
}
```

## Pengguna ##
**Mendapatkan Semua Pengguna**
**Endpoint:** GET /api/users

- Headers:

```
Authorization: Bearer YOUR_JWT_TOKEN
```
**Response:**
- 200 OK
```json
[
  {
    "id": "integer",
    "name": "string",
    "email": "string"
  }
]
```
**401 Unauthorized:**

```json
{
  "message": "Invalid token"
}
```
## Mendapatkan Pengguna Berdasarkan ID ##

**Endpoint**: GET /api/users/:id

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```
**Response:**

- 200 OK:

```json
{
  "id": "integer",
  "name": "string",
  "email": "string"
}
```
- 401 Unauthorized:

```json
{
  "message": "Invalid token"
}
```
## Memperbarui Pengguna ##
**Endpoint**: PUT /api/users/:id

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```
**Input:**

```json
{
  "name": "string",
  "email": "string"
}
```
**Response:**

- 200 OK:

```json
{
  "id": "integer",
  "name": "string",
  "email": "string"
}
```
**401 Unauthorized:**

```json
{
  "message": "Invalid token"
}
```
**Menghapus Pengguna**
**Endpoint:** DELETE /api/users/:id

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```
**Response:**
- 200 OK:

```json
{
  "message": "User deleted successfully"
}
```
- 401 Unauthorized:

```json
{
  "message": "Invalid token"
}
```
## Kategori ##
**Membuat Kategori Baru**
**Endpoint:** POST /api/categories

**Header:**

Authorization: Bearer YOUR_JWT_TOKEN
Input:

```json
{
  "name": "string"
}
```
Response:

- 200 OK:

```json
{
  "id": "integer",
  "name": "string"
}
```
- 401 Unauthorized:

```json
{
  "message": "Invalid token"
}
```
Mendapatkan Semua Kategori
**Endpoint:** GET /api/categories

**Header:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```
**Response:**

- 200 OK:

```json
[
  {
    "id": "integer",
    "name": "string"
  }
]
```
- 401 Unauthorized:

```json
{
  "message": "Invalid token"
}
```
Mendapatkan Kategori Berdasarkan ID
Endpoint: GET /api/categories/:id

**Headers:**

Authorization: Bearer YOUR_JWT_TOKEN
**Response:**

- 200 OK:

```json
{
  "id": "integer",
  "name": "string"
}
```
- 401 Unauthorized:

```json
{
  "message": "Invalid token"
}
```
Memperbarui Kategori
Endpoint: PUT /api/categories/:id

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```
**Input:**

```json
{
  "name": "string"
}
```
**Response:**
- 200 OK:

```json
{
  "id": "integer",
  "name": "string"
}
```
- 401 Unauthorized:

```json
{
  "message": "Invalid token"
}
```
###Menghapus Kategori###
Endpoint: DELETE /api/categories/:id

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```
**Response:**

- 200 OK:

```json
{
  "message": "Category deleted successfully"
}
```
- 401 Unauthorized:
  ```json
{
  "message": "Invalid token"
}
```
**Produk**
##Membuat Produk Baru##
Endpoint: POST /api/products

Headers:

Authorization: Bearer YOUR_JWT_TOKEN
Input:

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "integer",
  "categoryId": "integer"
}
```
**Response:**

- 200 OK:

```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "integer",
  "categoryId": "integer"
}
```
