import jwt from "jsonwebtoken";
import type { JwtPayload } from "@models/auth.model";

/**
 * Generate a test access token
 */
export function generateAccessToken(payload: Partial<JwtPayload> = {}): string {
  const defaultPayload: JwtPayload = {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    role: "user",
    ...payload,
  };

  return jwt.sign(
    defaultPayload,
    process.env.ACCESS_SECRET_KEY || "test-secret",
    {
      expiresIn: "10m",
    },
  );
}

/**
 * Generate a test refresh token
 */
export function generateRefreshToken(
  payload: Partial<JwtPayload> = {},
): string {
  const defaultPayload: JwtPayload = {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    role: "user",
    ...payload,
  };

  return jwt.sign(
    defaultPayload,
    process.env.REFRESH_SECRET_KEY || "test-refresh-secret",
    {
      expiresIn: "2d",
    },
  );
}

/**
 * Create authorization header with access token
 */
export function getAuthHeader(payload: Partial<JwtPayload> = {}): string {
  return `Bearer ${generateAccessToken(payload)}`;
}

/**
 * Create mock user data
 */
export const mockUsers = {
  admin: {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    password: "$2b$10$hashedPassword",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  user: {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    password: "$2b$10$hashedPassword",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

/**
 * Create mock product data
 */
export const mockProducts = {
  product1: {
    id: "product-1",
    name: "Product 1",
    description: "Test Product 1",
    price: 10000,
    categoryId: "category-1",
    userId: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  product2: {
    id: "product-2",
    name: "Product 2",
    description: "Test Product 2",
    price: 20000,
    categoryId: "category-1",
    userId: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

/**
 * Create mock category data
 */
export const mockCategories = {
  category1: {
    id: "category-1",
    name: "Electronics",
    description: "Electronic products",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  category2: {
    id: "category-2",
    name: "Clothing",
    description: "Clothing products",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

/**
 * Create mock order data
 */
export const mockOrders = {
  order1: {
    id: "order-1",
    userId: "user-1",
    totalPrice: 30000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  order2: {
    id: "order-2",
    userId: "user-1",
    totalPrice: 50000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

/**
 * Create mock order items
 */
export const mockOrderItems = {
  item1: {
    id: "order-item-1",
    orderId: "order-1",
    productId: "product-1",
    quantity: 2,
    price: 10000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  item2: {
    id: "order-item-2",
    orderId: "order-1",
    productId: "product-2",
    quantity: 1,
    price: 20000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};
