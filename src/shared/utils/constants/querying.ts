export const MAX_PAGE_SIZE = 100;
export const MAX_PAGE_NUMBER = 25;

export const DefaultPageSize = {
  USERS: 10,
  ACCOUNT: 10,
  CATEGORY: 10,
  MOVEMENT: 10,
} as const satisfies Record<string, number>;
