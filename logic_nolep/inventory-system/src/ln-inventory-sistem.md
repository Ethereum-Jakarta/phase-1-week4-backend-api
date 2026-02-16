# Logic Nolep (Inventory System)

Ini adalah Project/Tugas berkelanjutan di week4, kalian boleh memilih untuk memakai ODM (mongoose) atau Prisma (Mysql). bedanya dari 2 database tersebut hanyalah bentuk data dan schema. sisanya kita akan memepelajari hal yang sama, pada akhir week4 gua akan kasih 2 template ORM + ODM. jadi kalian sudah menentukan mau memakai SQL atau NO SQL.

tapi untuk contoh yang gua berikan disini, gua memakai prisma jadi kita pake mysql dari railway.
pertama kita pahamin Relasi Inventory System terlebih dahulu: 

![image](https://github.com/user-attachments/assets/d61f1920-e44a-431d-91d9-bfa849590d2a)


Ini adalah List API yang perlu di buat di Inventory System

1. **User API**:
- Create User: POST /api/users
- Get All Users: GET /api/users
- Get User by ID: GET /api/users/{userId}
- Update User: PUT /api/users/{userId}
- Delete User: DELETE /api/users/{userId}

2. **Auth API**: (For authentication purposes)
- User Login: POST /api/auth/login
- User Logout: POST /api/auth/logout
- User Register: POST /api/auth/register

3. **Product API**:
- Create Product: POST /api/products
- Get All Products: GET /api/products
- Get Product by ID: GET /api/products/{productId}
- Update Product: PUT /api/products/{productId}
- Delete Product: DELETE /api/products/{productId}
- Get Products by User: GET /api/users/{userId}/products

4. **Category API**:
- Create Category: POST /api/categories
- Get All Categories: GET /api/categories
- Get Category by ID: GET /api/categories/{categoryId}
- Update Category: PUT /api/categories/{categoryId}
- Delete Category: DELETE /api/categories/{categoryId}

5. **Order API**:
- Create Order: POST /api/orders
- Get All Orders: GET /api/orders
- Get Order by ID: GET /api/orders/{orderId}
- Update Order: PUT /api/orders/{orderId}
- Delete Order: DELETE /api/orders/{orderId}
- Get Orders by User: GET /api/users/{orderId}/orders

6. **OrderItem API**:
- Create OrderItem: POST /api/order-items
- Get All OrderItems: GET /api/order-items
- Get OrderItem by ID: GET /api/order-items/-{orderItemId}
- Update OrderItem: PUT /api/order-items/{orderItemId}
- Delete OrderItem: DELETE /api/order-items/{orderItemId}
- Get OrderItems by Order: GET /api/orders/{orderId}/order-items

***NOTE***
Semua code yang ada di Inventory System harus mengikuti instruksi sesuai part part yang dipelajarin materi selanjutnya.


## ***Inventory System Feature***
Dari skema database yang telah dibuat, project ini memiliki potensi untuk mengimplementasikan beberapa fitur. Berikut beberapa fitur yang dapat diimplementasikan:

1. **Manajemen Produk**:
- Tambahkan Produk: User dapat menambahkan produk baru ke dalam inventaris.
- Lihat Semua Produk: User dapat melihat daftar semua produk yang ada di inventaris.
- Lihat Produk per User: User dapat melihat daftar produk yang mereka miliki.
- Detail Produk: User dapat melihat detail produk termasuk deskripsi, harga, dan ketersediaan stok.
- Edit Produk: User dapat mengubah informasi produk yang ada.
- Hapus Produk: User dapat menghapus produk dari inventaris.

2. **Manajemen Kategori**:
- Tambahkan Kategori: User dapat membuat kategori baru untuk mengelompokkan produk.
- Lihat Semua Kategori: User dapat melihat daftar semua kategori yang ada.
- Edit Kategori: User dapat mengubah nama kategori.
- Hapus Kategori: User dapat menghapus kategori, dan produk yang terkait dengan kategori tersebut harus dikelola atau dihapus.

3. **Manajemen Pesanan**:
- Buat Pesanan: User dapat membuat pesanan dengan memilih produk, menentukan jumlah, dan mengisi informasi pelanggan.
- Lihat Semua Pesanan: User dapat melihat daftar semua pesanan yang telah dibuat.
- Lihat Pesanan per User: User dapat melihat pesanan yang mereka buat.
- Detail Pesanan: User dapat melihat detail pesanan termasuk produk yang dibeli, jumlah, total harga, tanggal pesanan, dan informasi pelanggan.
- Edit Pesanan: User dapat mengubah pesanan yang ada jika diperlukan.
- Hapus Pesanan: User dapat menghapus pesanan yang telah selesai atau dibatalkan.

4. **Manajemen Token dan Otentikasi User**:
- Registrasi User: User dapat mendaftar dan membuat akun dengan mengisi informasi dasar.
- Login User: User dapat masuk ke akun mereka dengan menggunakan email dan kata sandi.
- Otentikasi User: User akan diotentikasi melalui token saat menggunakan API yang memerlukan otentikasi.
- Token Refresh: User dapat memperbarui token mereka untuk menjaga sesi tetap aktif.
- Logout User: User dapat keluar dari akun mereka.

5. **Manajemen Role**:
ada beberapa tipe role dalam project ini:
 
- User: role ini  hanya bisa memakai fitur manajemen produk (role user tidak bisa menggunakan order API). 
- Admin: Role Admin bisa akses semua fitur.

## Project Set Up
Di Inventory system ada beberapa hal yang harus kita set up, beda dari project sebelumnya. karena project ini memakai structure advance yang ready buat production.

kalian bisa copas dari fancy-todo-prisma kemarin buat awalan set up :

![image](https://github.com/user-attachments/assets/84e51c0e-3c45-4837-89b1-3fb98c283b47)

## New Folder Setup 
setelah itu tambahkan folder baru untuk stuktur baru kita :
- config : folder untuk mengatur semua config buat server kita. backend yang bagus itu pasti mempunyai set up configurasi yang baik agar bisa di scaling sesuai kebutuhan.

- middlewares : folder untuk menyimpan file file custom middleware, karena kita akan membuat beberapa custom middleware seperti authentication, error handler dan validation.

- utils : folder untuk menyimpan file file function tambahan yang bisa reusable (dipakai berkali kali) dalam kebutuhan backend kita, contoh nya custom Api Error dan Catch Async function dimana kita membuat sistem Catch sendiri di backend kita.

- validations : folder untuk menyimpan file file validation menggunakan library joi, file ini di combine dengan middleware validate untuk validasi body sesuai API dan schema yang kita buat.

![image](https://github.com/user-attachments/assets/c21846c2-0a4f-4507-9312-e809316b52e2)

##  package.json 
Ada banyak sekali library baru yang harus kalian pelajari untuk struktur advance ini, jadi kalian bisa copas pakcage.json ini untuk menginstall sekaligus library yang kita butuhkan (dari pada npm install satu persatu).

kita akan bahas semua fungsi dari semua library yang kita install di week4 ini.
```json
{
  "name": "inventory-system",
  "version": "1.7.0",
  "description": "Inventory System Backend",
  "bin": "bin/createNodejsApp.js",
  "main": "src/index.js",
  "repository": "URL Repo kalian",
  "author": "Faisal Firdani <faisalfirdani01@gmail.com>",
  "license": "MIT",
  "engines": {
    "node": ">=12.0.0"
  },
  "scripts": {
    "start": "pm2 start ecosystem.config.json --no-daemon",
    "dev": "cross-env NODE_ENV=development nodemon src/index.js",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "prettier": "prettier --check **/*.js",
    "prettier:fix": "prettier --write **/*.js"
  },
  "keywords": [
    "node",
    "node.js",
    "boilerplate",
    "generator",
    "express",
    "rest",
    "api",
    "es6",
    "es7",
    "es8",
    "es9",
    "travis",
    "docker",
    "passport",
    "joi",
    "eslint",
    "prettier"
  ],
  "dependencies": {
    "@prisma/client": "^5.3.1",
    "bcryptjs": "^2.4.3",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "cross-env": "^7.0.0",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "express-rate-limit": "^5.0.0",
    "helmet": "^4.1.0",
    "http-status": "^1.4.0",
    "joi": "^17.3.0",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.24.0",
    "morgan": "^1.9.1",
    "nodemailer": "^6.3.1",
    "passport": "^0.4.0",
    "passport-jwt": "^4.0.0",
    "pm2": "^5.1.0",
    "swagger-jsdoc": "^6.0.8",
    "swagger-ui-express": "^4.1.6",
    "validator": "^13.0.0",
    "winston": "^3.2.1",
    "xss-clean": "^0.1.1"
  },
  "devDependencies": {
    "coveralls": "^3.0.7",
    "eslint": "^7.0.0",
    "eslint-config-airbnb-base": "^14.0.0",
    "eslint-config-prettier": "^8.1.0",
    "eslint-plugin-import": "^2.18.2",
    "eslint-plugin-jest": "^24.0.1",
    "eslint-plugin-prettier": "^3.1.1",
    "eslint-plugin-security": "^1.4.0",
    "faker": "^5.1.0",
    "husky": "^7.0.0",
    "jest": "^26.0.1",
    "lint-staged": "^11.0.0",
    "node-mocks-http": "^1.8.0",
    "nodemon": "^2.0.0",
    "prettier": "^2.0.5",
    "prisma": "^5.3.1",
    "supertest": "^6.0.1"
  }
}
```

hapus package-lock.json sebelumnya agar tidak nabrak dengan library baru.
jalankan npm install setelah copas package.json nya. 
