# Backend Setup Steps for Inventory & Order Management System

This document outlines the steps to set up the Node.js backend with MySQL database for the Inventory & Order Management System.

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Step 1: Initialize Node.js Project

```bash
mkdir inventory-order-management-backend
cd inventory-order-management-backend
npm init -y
```

## Step 2: Install Dependencies

```bash
# Core dependencies
npm install express cors dotenv
npm install mysql2
npm install bcryptjs jsonwebtoken
npm install express-validator
npm install express-rate-limit
npm install helmet
npm install morgan

# Development dependencies
npm install --save-dev nodemon
npm install --save-dev eslint
npm install --save-dev @types/node
```

## Step 3: Project Structure

Create the following directory structure:

```
inventory-order-management-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL connection configuration
│   │   └── jwt.js                # JWT configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── inventoryController.js
│   │   ├── orderController.js
│   │   ├── supplierController.js
│   │   ├── returnController.js
│   │   ├── auditController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js               # Authentication middleware
│   │   ├── roleCheck.js          # Role-based access control
│   │   ├── errorHandler.js       # Error handling middleware
│   │   └── validator.js          # Request validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Inventory.js
│   │   ├── Warehouse.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Supplier.js
│   │   ├── PurchaseOrder.js
│   │   ├── Return.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── inventory.js
│   │   ├── orders.js
│   │   ├── suppliers.js
│   │   ├── returns.js
│   │   ├── audit.js
│   │   └── users.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── inventoryService.js
│   │   ├── orderService.js
│   │   └── stockService.js        # Stock reservation/release logic
│   ├── utils/
│   │   ├── logger.js
│   │   └── helpers.js
│   └── app.js                    # Express app setup
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js                     # Entry point
```

## Step 4: Database Setup

### 4.1 Create MySQL Database

```sql
CREATE DATABASE inventory_management;
USE inventory_management;
```

### 4.2 Create Database Tables

Create the following tables:

#### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'staff') NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Categories Table
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  category_id INT,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  reorder_level INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

#### Warehouses Table
```sql
CREATE TABLE warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Inventory Table
```sql
CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  warehouse_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  reserved_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_product_warehouse (product_id, warehouse_id)
);
```

#### Stock Movements Table
```sql
CREATE TABLE stock_movements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  warehouse_id INT NOT NULL,
  quantity INT NOT NULL,
  type ENUM('add', 'remove', 'reserve', 'release') NOT NULL,
  reason TEXT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

#### Suppliers Table
```sql
CREATE TABLE suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  contact_person VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Purchase Orders Table
```sql
CREATE TABLE purchase_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  supplier_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'received', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  expected_delivery_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);
```

#### Purchase Order Items Table
```sql
CREATE TABLE purchase_order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  purchase_order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2),
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  status ENUM('created', 'confirmed', 'packed', 'shipped', 'delivered', 'closed', 'cancelled') DEFAULT 'created',
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### Returns Table
```sql
CREATE TABLE returns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  return_number VARCHAR(100) UNIQUE NOT NULL,
  order_id INT NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'processed') DEFAULT 'pending',
  refund_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

#### Return Items Table
```sql
CREATE TABLE return_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  return_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

#### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  old_values JSON,
  new_values JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_user (user_id),
  INDEX idx_created (created_at)
);
```

## Step 5: Environment Configuration

Create `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_management
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Step 6: Database Connection Setup

Create `src/config/database.js`:

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

## Step 7: Authentication Middleware

Create `src/middleware/auth.js`:

```javascript
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
```

## Step 8: Role-Based Access Control

Create `src/middleware/roleCheck.js`:

```javascript
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

module.exports = checkRole;
```

## Step 9: API Routes Structure

### Example: Products Route (`src/routes/products.js`)

```javascript
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const productController = require('../controllers/productController');

router.get('/', authenticate, productController.getProducts);
router.get('/:id', authenticate, productController.getProductById);
router.post('/', authenticate, checkRole('admin', 'manager'), productController.createProduct);
router.put('/:id', authenticate, checkRole('admin', 'manager'), productController.updateProduct);
router.delete('/:id', authenticate, checkRole('admin'), productController.deleteProduct);

module.exports = router;
```

## Step 10: Stock Reservation Logic

Implement stock reservation/release in `src/services/stockService.js`:

```javascript
const pool = require('../config/database');

async function reserveStock(productId, warehouseId, quantity, orderId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check available stock
    const [inventory] = await connection.query(
      'SELECT quantity, reserved_quantity FROM inventory WHERE product_id = ? AND warehouse_id = ?',
      [productId, warehouseId]
    );

    const available = inventory[0].quantity - inventory[0].reserved_quantity;
    if (available < quantity) {
      throw new Error('Insufficient stock');
    }

    // Reserve stock
    await connection.query(
      'UPDATE inventory SET reserved_quantity = reserved_quantity + ? WHERE product_id = ? AND warehouse_id = ?',
      [quantity, productId, warehouseId]
    );

    // Log movement
    await connection.query(
      'INSERT INTO stock_movements (product_id, warehouse_id, quantity, type, reason, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [productId, warehouseId, quantity, 'reserve', `Reserved for order ${orderId}`, req.user.id]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { reserveStock, releaseStock };
```

## Step 11: Order Lifecycle Management

Implement order status transitions with stock updates:

- **Created → Confirmed**: Reserve stock
- **Confirmed → Packed**: Keep reservation
- **Packed → Shipped**: Deduct stock, release reservation
- **Shipped → Delivered**: Update order
- **Delivered → Closed**: Finalize order
- **Any → Cancelled**: Release reserved stock

## Step 12: Audit Logging

Create middleware to log all actions:

```javascript
const auditLog = async (req, res, next) => {
  const originalSend = res.json;
  res.json = function(data) {
    // Log the action after response
    logAction(req, data);
    return originalSend.call(this, data);
  };
  next();
};
```

## Step 13: Error Handling

Create centralized error handler:

```javascript
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## Step 14: API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters, pagination)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin/Manager)
- `PUT /api/products/:id` - Update product (Admin/Manager)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/products/categories` - List categories
- `POST /api/products/categories` - Create category

### Inventory
- `GET /api/inventory` - List inventory
- `GET /api/inventory/stock-levels` - Get stock levels
- `GET /api/inventory/low-stock` - Get low stock items
- `POST /api/inventory/adjust` - Adjust stock
- `GET /api/inventory/movements` - Get stock movements
- `POST /api/inventory/reserve` - Reserve stock
- `POST /api/inventory/release` - Release stock
- `GET /api/inventory/warehouses` - List warehouses

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

### Suppliers
- `GET /api/suppliers` - List suppliers
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers/purchase-orders` - List purchase orders
- `POST /api/suppliers/purchase-orders` - Create purchase order

### Returns
- `GET /api/returns` - List returns
- `POST /api/returns` - Create return request
- `POST /api/returns/:id/refund` - Process refund

### Audit
- `GET /api/audit/logs` - Get audit logs
- `GET /api/audit/export` - Export audit logs

### Dashboard
- `GET /api/dashboard/kpis` - Get KPIs
- `GET /api/dashboard/recent-activity` - Get recent activity

## Step 15: Testing

1. Test authentication flow
2. Test CRUD operations for each module
3. Test role-based access control
4. Test stock reservation/release logic
5. Test order lifecycle transitions
6. Test audit logging

## Step 16: Security Considerations

1. Use HTTPS in production
2. Implement rate limiting
3. Sanitize user inputs
4. Use parameterized queries (prevent SQL injection)
5. Hash passwords with bcrypt
6. Validate JWT tokens
7. Implement CORS properly
8. Use helmet.js for security headers

## Step 17: Deployment

1. Set up production database
2. Configure environment variables
3. Set up reverse proxy (nginx)
4. Configure SSL certificates
5. Set up monitoring and logging
6. Implement backup strategy

## Notes

- All API endpoints should return consistent JSON responses
- Use transactions for operations that modify multiple tables
- Implement proper error handling and validation
- Add indexes to frequently queried columns
- Consider implementing caching for frequently accessed data
- Set up database migrations for schema changes
