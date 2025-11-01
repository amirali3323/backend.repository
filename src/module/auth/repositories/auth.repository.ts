import { SignupDto } from "../dto/signupUser.dto"; 
import { User, UserRole } from "../entities/user.entity";
import { InjectModel } from "@nestjs/sequelize";
import { IAuthRepository } from "../interfaces/auth.repository.interface"; 

export class AuthRepository implements IAuthRepository {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,

    ) { }
    async createUser(data: {
        name: string,
        password: string,
        phoneNumber: string,
        email: string,
    }): Promise<User> {
        return await this.userModel.create(data);
    }

    async findById(id: number): Promise<User | null> {
        return await this.userModel.findOne({ where: { id } });
    }

    async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
        return await this.userModel.findOne({ where: { phoneNumber } })
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ where: { email } });
    }

    async updatePassword(userId: number, newPassword: string): Promise<void> {
        const [updatedRows] = await this.userModel.update(
            { password: newPassword },
            { where: { id: userId } },
        );
    }

    async updateAvatarUrl(filename: string, id: number) {
        return await this.userModel.update({ avatarUrl: filename }, { where: { id } })
    }


    async getAll(): Promise<User[]> {
        return await this.userModel.findAll();
    }
}