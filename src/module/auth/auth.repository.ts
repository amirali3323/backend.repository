import { SignupDto } from "./dto/createUser.dto";
import { User, UserRole } from "./entities/user.entity";
import { InjectModel } from "@nestjs/sequelize";
import { IAuthRepository } from "./interfaces/auth.repository.interface";

export class AuthRepository implements IAuthRepository {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,

    ) { }
    async createUser(data: {
        role?: UserRole,
        userName: string,
        password: string,
        phoneNumber: string,
        email?: string,
        profile?: string,
    }): Promise<User> {
        return await this.userModel.create(data);
    }

    async findById(id: number): Promise<User | null> {
        return await this.userModel.findOne({ where: { id } });
    }

    async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
        return await this.userModel.findOne({ where: { phoneNumber } })
    }

    async findByUsername(userName: string): Promise<User | null> {
        return await this.userModel.findOne({ where: { userName } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ where: { email } });
    }

    async updatePassword(userId: number, newPassword: string): Promise<void> {
        const [updatedRows] = await this.userModel.update(
            { password: newPassword },
            { where: { id: userId } },
        );

        if (updatedRows === 0) {
            throw new Error('User not found');
        }
    }

    async getAll(): Promise<User[]> {
        return await this.userModel.findAll();
    }
}