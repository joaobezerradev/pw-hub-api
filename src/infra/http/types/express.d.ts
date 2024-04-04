import 'express';
import { AccountRole } from '../../../domain/constants';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string, roleId: AccountRole }
  }
}
