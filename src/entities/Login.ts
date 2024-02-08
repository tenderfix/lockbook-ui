/**
 * based on https://dev.api.auth.lock-book.com/#operation/login
 */

import { Role } from './User';

// related entities
export interface ILoginResponse {
  data: {
    id: number;
    username: string;
    roles: Role[];
  };
}
