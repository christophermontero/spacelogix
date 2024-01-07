const httpResponses = {
  OK: {
    code: 'SUCCESS',
    message: 'The request has completed successfully'
  },
  CREATED: {
    code: 'CREATED',
    message: 'The request has completed successfully'
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Token is invalid'
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'User has invalid role'
  },
  USER_TAKEN: {
    code: 'USER_TAKEN',
    message: 'User already exists'
  },
  USER_NOT_EXISTS: {
    code: 'USER_NOT_EXISTS',
    message: 'User not exists'
  },
  PRODUCT_NOT_EXISTS: {
    code: 'PRODUCT_NOT_EXISTS',
    message: 'Product not exists'
  },
  ORDER_NOT_EXISTS: {
    code: 'ORDER_NOT_EXISTS',
    message: 'Order not exists'
  },
  INVALID_PASSWORD: {
    code: 'INVALID_PASSWORD',
    message: 'Invalid password'
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: '¡Ups! An error has occurred'
  }
};

export default httpResponses;
