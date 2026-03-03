export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
};

export const hasRole = (userRole, requiredRole) => {
  const roleHierarchy = {
    [ROLES.ADMIN]: 3,
    [ROLES.MANAGER]: 2,
    [ROLES.STAFF]: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const canAccess = (userRole, resource, action) => {
  const permissions = {
    [ROLES.ADMIN]: {
      products: ['create', 'read', 'update', 'delete'],
      inventory: ['create', 'read', 'update', 'delete'],
      orders: ['create', 'read', 'update', 'delete'],
      suppliers: ['create', 'read', 'update', 'delete'],
      returns: ['create', 'read', 'update', 'delete'],
      audit: ['read'],
      users: ['create', 'read', 'update', 'delete'],
    },
    [ROLES.MANAGER]: {
      products: ['create', 'read', 'update'],
      inventory: ['create', 'read', 'update'],
      orders: ['create', 'read', 'update'],
      suppliers: ['create', 'read', 'update'],
      returns: ['create', 'read', 'update'],
      audit: ['read'],
      users: ['read'],
    },
    [ROLES.STAFF]: {
      products: ['read'],
      inventory: ['read', 'update'],
      orders: ['create', 'read', 'update'],
      suppliers: ['read'],
      returns: ['create', 'read'],
      audit: [],
      users: [],
    },
  };

  return permissions[userRole]?.[resource]?.includes(action) || false;
};
