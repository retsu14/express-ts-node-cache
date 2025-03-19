export type User = {
  username: string;
  email: string;
  password: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
};
