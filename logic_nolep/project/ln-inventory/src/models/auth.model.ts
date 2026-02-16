import type { Request } from "express";

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
}

export interface RequestUser extends JwtPayload {
  token?: string;
}

// export interface RequestWithUser extends Request {
//   user: RequestUser;
// }
