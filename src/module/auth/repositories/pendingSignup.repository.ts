import { InjectModel } from "@nestjs/sequelize";
import { PendingSignup } from "../entities/pendingsignup.entity";
// import { IPendingSignupRepository } from "../interfaces/pendingSignup.repo.interface";

export class PendingSignupRepository {
    constructor(
        @InjectModel(PendingSignup)
        private pendingUserModel: typeof PendingSignup,
    ) { }

    async createUser(data: {
        name: string;
        password: string;
        phoneNumber: string;
        email: string;
        code: string;
    }): Promise<PendingSignup> {
        return await this.pendingUserModel.create(data);
    }

    async verifyEmail(email: string, code: string): Promise<PendingSignup | null> {
        return await this.pendingUserModel.findOne({ where: { email, code } });
    }

    async delete(id: number): Promise<number> {
        return await this.pendingUserModel.destroy({ where: { id } });
    }

    async deleteByEmail(email: string): Promise<number> {
        return await this.pendingUserModel.destroy({ where: { email } });
    }

    async findLatestByEmail(email: string): Promise<PendingSignup | null> {
        return await this.pendingUserModel.findOne({
            where: { email },
            order: [['createdAt', 'DESC']],
        });
    }

    async updateVerifyCode(id: number, code: string): Promise<[affectedCount: number]> {
        return await this.pendingUserModel.update({ code }, { where: { id } });
    }
}
