export enum Role {
  Manager = 'Manager',
  User = 'User',
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}
