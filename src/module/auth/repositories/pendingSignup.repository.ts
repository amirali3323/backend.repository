import { InjectModel } from "@nestjs/sequelize";
import { PendingSignup } from "../entities/pendingsignup.entity";
import { IPendingSignupRepository } from "../interfaces/pendingSignup.repo.interface";

export class PendingSignupRepository implements IPendingSignupRepository {
    constructor(
        @InjectModel(PendingSignup)
        private pendingUserModel: typeof PendingSignup,
    ) { }

    // Create a new pending signup record
    async createUser(data: {
        name: string;
        password: string;
        phoneNumber: string;
        email: string;
        code: string;
    }): Promise<PendingSignup> {
        return await this.pendingUserModel.create(data);
    }

    // Verify email with code
    async verifyEmail(email: string, code: string): Promise<PendingSignup | null> {
        return await this.pendingUserModel.findOne({ where: { email, code } });
    }

    // Delete a pending signup by ID
    async delete(id: number): Promise<number> {
        return await this.pendingUserModel.destroy({ where: { id } });
    }

    // Delete pending signup(s) by email
    async deleteByEmail(email: string): Promise<number> {
        return await this.pendingUserModel.destroy({ where: { email } });
    }

    // Find the latest pending signup for an email
    async findLatestByEmail(email: string): Promise<PendingSignup | null> {
        return await this.pendingUserModel.findOne({
            where: { email },
            order: [['createdAt', 'DESC']],
        });
    }

    // Update the verification code for a pending signup
    async updateVerifyCode(id: number, code: string): Promise<[affectedCount: number]> {
        return await this.pendingUserModel.update({ code }, { where: { id } });
    }
}

