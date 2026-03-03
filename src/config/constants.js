export const ORDER_STATUSES = {
  CREATED: 'created',
  CONFIRMED: 'confirmed',
  PACKED: 'packed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_FLOW = [
  ORDER_STATUSES.CREATED,
  ORDER_STATUSES.CONFIRMED,
  ORDER_STATUSES.PACKED,
  ORDER_STATUSES.SHIPPED,
  ORDER_STATUSES.DELIVERED,
  ORDER_STATUSES.CLOSED,
];

export const STOCK_ADJUSTMENT_TYPES = {
  ADD: 'add',
  REMOVE: 'remove',
};

export const RETURN_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PROCESSED: 'processed',
};
