import { User } from '../entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { IAuthRepository } from '../interfaces/auth.repo.interface';
import sequelize from 'sequelize/lib/sequelize';

export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  // Create a new user
  async createUser(data: { name: string; password: string; phoneNumber: string; email: string }): Promise<User> {
    return await this.userModel.create(data);
  }

  // Find user by ID
  async findById(id: number): Promise<User | null> {
    return await this.userModel.findOne({ where: { id } });
  }

  // Find user by phone number
  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { phoneNumber } });
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { email } });
  }

  // Update user's password
  async updatePassword(userId: number, newPassword: string): Promise<void> {
    await this.userModel.update({ password: newPassword }, { where: { id: userId } });
  }

  // Update user's profile image URL
  async updateAvatarUrl(filename: string, id: number): Promise<void> {
    await this.userModel.update({ avatarUrl: filename }, { where: { id } });
  }

  // Retrieve all users
  async getAll(): Promise<User[]> {
    return await this.userModel.findAll();
  }

  async getUserCount(): Promise<any> {
    return await this.userModel.count();
  }

  async getMe(id: number) {
    return await this.userModel.findOne({
      where: {id},
      attributes: ['name', 'role', 'avatarUrl', 'email', 'phoneNumber'],
    })
  }
}
