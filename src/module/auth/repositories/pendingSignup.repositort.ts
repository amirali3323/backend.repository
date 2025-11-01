import { PendingSignup } from "../entities/pendingsignup.entity"; 
import { InjectModel } from "@nestjs/sequelize";

export class PendingSignupRepository {
    constructor(
        @InjectModel(PendingSignup)
        private pendingUserModel: typeof PendingSignup,

    ) { }
    async createUser(data: {
        name: string,
        password: string,
        phoneNumber: string,
        email: string,
        code: string,
    }): Promise<PendingSignup> {
        return await this.pendingUserModel.create(data);
    }

    async findByEmail(email: string): Promise<PendingSignup | null> {
        return await this.pendingUserModel.findOne({ where: { email } });
    }

    async delete(id: number) {
        return await this.pendingUserModel.destroy({ where: { id } });
    }

}