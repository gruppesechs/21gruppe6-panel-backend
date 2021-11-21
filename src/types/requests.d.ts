export type LoginRequest = {
  Body: {
    email: string,
    password: string,
  },
};

export type RegisterRequest = {
  Body: {
    email: string,
    provisioningToken: string,
    password: string,
  },
};
