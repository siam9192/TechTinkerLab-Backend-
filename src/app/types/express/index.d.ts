// express.d.ts
import * as express from 'express';
import { TRole } from '../../modules/user/user.interface';

declare global {
  namespace Express {
    interface Request {
      user: { id: string; role: TRole }; // Example of a user object
    }
  }
}
