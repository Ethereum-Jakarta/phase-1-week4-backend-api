import type { User } from "../../generated/prisma/client";

export type UserResponse = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

export type createUserRequest = {
  name: string;
  phone?: string;
  email?: string;
};

export type updateUserRequest = {
  name: string;
  phone?: string;
  email?: string;
};

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone ?? "",
    email: user.email ?? "",
  };
}
