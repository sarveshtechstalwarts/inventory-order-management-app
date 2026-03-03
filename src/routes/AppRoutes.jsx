import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import Login from '@/features/auth/pages/Login';
import Dashboard from '@/features/dashboard/pages/Dashboard';
import ProductList from '@/features/products/pages/ProductList';
import ProductForm from '@/features/products/pages/ProductForm';
import ProductDetail from '@/features/products/pages/ProductDetail';
import InventoryDashboard from '@/features/inventory/pages/InventoryDashboard';
import StockAdjustment from '@/features/inventory/pages/StockAdjustment';
import StockMovements from '@/features/inventory/pages/StockMovements';
import SupplierList from '@/features/suppliers/pages/SupplierList';
import SupplierForm from '@/features/suppliers/pages/SupplierForm';
import PurchaseOrderList from '@/features/suppliers/pages/PurchaseOrderList';
import OrderList from '@/features/orders/pages/OrderList';
import OrderForm from '@/features/orders/pages/OrderForm';
import OrderDetail from '@/features/orders/pages/OrderDetail';
import ReturnList from '@/features/returns/pages/ReturnList';
import ReturnForm from '@/features/returns/pages/ReturnForm';
import AuditLog from '@/features/audit/pages/AuditLog';
import Profile from '@/features/profile/pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="inventory" element={<InventoryDashboard />} />
        <Route path="inventory/adjust" element={<StockAdjustment />} />
        <Route path="inventory/movements" element={<StockMovements />} />
        <Route path="suppliers" element={<SupplierList />} />
        <Route path="suppliers/new" element={<SupplierForm />} />
        <Route path="suppliers/:id/edit" element={<SupplierForm />} />
        <Route
          path="suppliers/purchase-orders"
          element={<PurchaseOrderList />}
        />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/new" element={<OrderForm />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="returns" element={<ReturnList />} />
        <Route path="returns/new" element={<ReturnForm />} />
        <Route path="audit" element={<AuditLog />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
