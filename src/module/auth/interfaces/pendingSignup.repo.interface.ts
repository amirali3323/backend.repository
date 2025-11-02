import { PendingSignup } from '../entities/pendingsignup.entity';

export interface IPendingSignupRepository {
  createUser(data: {
    name: string;
    password: string;
    phoneNumber: string;
    email: string;
    code: string;
  }): Promise<PendingSignup>;

  verifyEmail(email: string, code: string): Promise<PendingSignup | null>;

  delete(id: number): Promise<number>;

  deleteByEmail(email: string): Promise<number>;

  findLatestByEmail(email: string): Promise<PendingSignup | null>;

  updateVerifyCode(id: number, code: string): Promise<[affectedCount: number]>;
}
