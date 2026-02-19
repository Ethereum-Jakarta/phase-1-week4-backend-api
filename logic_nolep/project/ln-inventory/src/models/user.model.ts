import type { Role, User } from "@generated/prisma/client";

export type RegisterUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  name: string;
  email: string;
};

export class RegisterUserDto {
  public id: string;
  public name: string;
  public email: string | null;
  public createdAt: Date;
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}

export class LoginDto {
  public id: string;
  public name: string;
  public email: string | null;
  public accessToken: string;
  public refreshToken: string;
  constructor(user: User, accessToken: string, refreshToken: string) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

export class UpdateUserDto {
  public id: string;
  public name: string;
  public email: string | null;
  public updatedAt: Date;
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.updatedAt = user.updatedAt;
  }
}

export class SelectUserDto {
  public id: string;
  public name: string;
  public email: string | null;
  public role: Role;
  public created_at: Date;
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.created_at = user.createdAt;
  }
}
