export const DB_ORDERS = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type DBOrders = (typeof DB_ORDERS)[keyof typeof DB_ORDERS];
