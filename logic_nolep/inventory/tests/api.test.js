const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../src/app'); 
const prisma = require('../src/config/db'); 

let userToken;
let adminToken;
let categoryId;
let productId;
let orderId;

describe('API Tests - Auth, Users, Categories, Products & Orders', () => {
  beforeAll(async () => {
    console.log('Setup database for testing...');

    
    const existingUser = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: await bcrypt.hash('password123', 10),
          role: 'User',
        },
      });
    }

   
    const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: await bcrypt.hash('password123', 10),
          role: 'Admin',
        },
      });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ====================== AUTENTIKASI ======================
  it('should login the user and return JWT token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');

    userToken = res.body.token;
  });

  it('should login the admin and return JWT token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');

    adminToken = res.body.token;
  });

  // ====================== KATEGORI ======================
  it('should create a new category (Admin Only)', async () => {
    if (!adminToken) fail('Skipping category creation test due to missing admin token.');

    const existingCategory = await prisma.category.findFirst({ where: { name: 'New Category' } });

    if (existingCategory) {
      console.log('Category already exists, using existing category.');
      categoryId = existingCategory.id;
      return;
    }

    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'New Category' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');

    categoryId = res.body.id;
  });

  it('should fetch all categories', async () => {
    const res = await request(app).get('/api/categories').set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  // ====================== PRODUK ======================
  it('should create a new product (Admin Only)', async () => {
    if (!adminToken) fail('Skipping product creation test due to missing admin token.');
    if (!categoryId) fail('Skipping product creation test due to missing category ID.');

    const existingProduct = await prisma.product.findFirst({ where: { name: 'Test Product' } });

    if (existingProduct) {
      console.log('Product already exists, using existing product.');
      productId = existingProduct.id;
      return;
    }

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        stock: 10,
        categoryId: categoryId,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');

    productId = res.body.id;
  });

  it('should fetch all products', async () => {
    const res = await request(app).get('/api/products').set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single product', async () => {
    if (!productId) fail('Skipping single product test due to missing product ID.');

    const res = await request(app).get(`/api/products/${productId}`).set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', productId);
  });

  // ====================== PESANAN ======================
  it('should create a new order', async () => {
    if (!userToken) fail('Skipping order creation test due to missing user token.');
    if (!productId) fail('Skipping order creation test due to missing product ID.');

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        total: 100,
        userId: 1, // Sesuaikan dengan user yang ada
        orderItems: [
          {
            quantity: 2,
            price: 50,
            productId: productId,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');

    orderId = res.body.id;
  });

  it('should fetch all orders', async () => {
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single order', async () => {
    if (!orderId) fail('Skipping single order test due to missing order ID.');

    const res = await request(app).get(`/api/orders/${orderId}`).set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', orderId);
  });
});

