import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const productSchema = yup.object().shape({
  name: yup.string().required('Product name is required'),
  description: yup.string(),
  categoryId: yup.string().required('Category is required'),
  sku: yup.string().required('SKU is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  cost: yup.number().positive('Cost must be positive'),
  reorderLevel: yup.number().min(0, 'Reorder level must be non-negative'),
});

export const categorySchema = yup.object().shape({
  name: yup.string().required('Category name is required'),
  description: yup.string(),
});

export const supplierSchema = yup.object().shape({
  name: yup.string().required('Supplier name is required'),
  email: yup.string().email('Invalid email'),
  phone: yup.string(),
  address: yup.string(),
  contactPerson: yup.string(),
});

export const orderSchema = yup.object().shape({
  customerName: yup.string().required('Customer name is required'),
  customerEmail: yup.string().email('Invalid email'),
  items: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.string().required('Product is required'),
        quantity: yup
          .number()
          .positive('Quantity must be positive')
          .required('Quantity is required'),
      })
    )
    .min(1, 'At least one item is required'),
});

export const stockAdjustmentSchema = yup.object().shape({
  productId: yup.string().required('Product is required'),
  warehouseId: yup.string().required('Warehouse is required'),
  quantity: yup.number().required('Quantity is required'),
  reason: yup.string().required('Reason is required'),
  type: yup.string().oneOf(['add', 'remove']).required('Type is required'),
});

export const purchaseOrderSchema = yup.object().shape({
  supplierId: yup.string().required('Supplier is required'),
  items: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.string().required('Product is required'),
        quantity: yup
          .number()
          .positive('Quantity must be positive')
          .required('Quantity is required'),
        unitPrice: yup.number().positive('Unit price must be positive'),
      })
    )
    .min(1, 'At least one item is required'),
  expectedDeliveryDate: yup.date(),
});

export const returnSchema = yup.object().shape({
  orderId: yup.string().required('Order is required'),
  reason: yup.string().required('Reason is required'),
  items: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.string().required('Product is required'),
        quantity: yup
          .number()
          .positive('Quantity must be positive')
          .required('Quantity is required'),
      })
    )
    .min(1, 'At least one item is required'),
});

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});
