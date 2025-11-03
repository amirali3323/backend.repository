import { User } from '../entities/user.entity';

export interface IAuthRepository {
  createUser(data: { name: string; password: string; phoneNumber: string; email: string }): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  getAll(): Promise<User[]>;
  updatePassword(userId: number, newPassword: string): Promise<void>;
  updateAvatarUrl(filename: string, id: number): Promise<void>;
}
