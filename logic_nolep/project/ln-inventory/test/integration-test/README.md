# Integration Tests Implementation

Complete integration tests for the LN Inventory API using supertest and Prisma mocks.

## Files Structure

### test-utils.ts
Reusable utilities for integration testing:
- JWT token generators (access and refresh tokens)
- Mock user, product, category, and order data
- Helper functions for creating auth headers

### Test Suites

#### auth.test.ts (15 tests)
Tests for authentication endpoints:
- **Register** - User registration with validation
- **Login** - User authentication with credentials
- **Logout** - Session termination  
- **Refresh** - Access token refresh using refresh token

#### category.test.ts (17 tests)
Tests for category CRUD operations:
- Create category
- Retrieve all categories with pagination
- Retrieve single category
- Update category
- Delete category
- Role-based access control (admin only)

#### product.test.ts (20 tests)
Tests for product CRUD operations:
- Create product with category association
- Retrieve all products
- Retrieve single product
- Retrieve products by user (admin)
- Update product details
- Delete product
- Input validation (price, category)

#### order.test.ts (22 tests)
Tests for order management:
- Create order with items
- Retrieve all orders
- Retrieve single order
- Retrieve user orders (admin)
- Update order status
- Delete order
- Item quantity validation

#### user.test.ts (22 tests)
Tests for user management (admin only):
- Create user with validation
- Retrieve all users
- Retrieve single user
- Update user information
- Delete user
- Email uniqueness validation
- Admin role enforcement

## Testing Patterns

### Authentication Setup
```javascript
const adminAuth = getAuthHeader({ id: "admin-1", role: "admin" });
const userAuth = getAuthHeader({ id: "user-1", role: "user" });
```

### Mock Database Setup
```javascript
beforeEach(() => {
  mockReset(prisma);
});

prisma.user.findUnique.mockResolvedValue(mockUsers.user);
prisma.user.create.mockResolvedValue(createdUser);
```

### Request Example
```javascript
const response = await request(app)
  .post("/api/products")
  .set("Authorization", userAuth)
  .send(createPayload)
  .expect(201);
```

## Test Coverage

**Total: 96 tests across 5 domains**

- Auth: 15 tests
- Category: 17 tests  
- Product: 20 tests
- Order: 22 tests
- User: 22 tests

### Scenario Coverage
- ✅ Success cases with valid data and authentication
- ✅ Input validation (required fields, format validation)
- ✅ Authentication (token verification, role validation)
- ✅ Authorization (admin vs user permissions)
- ✅ Not found errors (non-existent resources)
- ✅ Duplicate data errors (existing email, etc)

## Running Tests

```bash
# All integration tests
npm test -- test/integration-test/

# Specific domain
npm test -- test/integration-test/auth.test.ts
npm test -- test/integration-test/category.test.ts
npm test -- test/integration-test/product.test.ts
npm test -- test/integration-test/order.test.ts
npm test -- test/integration-test/user.test.ts

# With coverage report
npm test -- test/integration-test/ --coverage
```

## Key Configuration

### Setup Files
- **test/setup.ts** - JWT secrets and mock database configuration
- **jest.config.mjs** - Path aliases and test environment setup

### Mock Database
- Uses `jest-mock-extended` for Prisma client mocking
- Configured in `test/__mocks__/prisma-client.mock.ts`
- All database operations are mocked

## Test Results

The test suite validates:
1. All endpoint routes are accessible
2. Authentication and authorization work correctly
3. Input validation is enforced
4. Database operations are called with correct parameters
5. Response format and status codes are appropriate
6. Error handling functions as expected
