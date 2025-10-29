import { SignupDto } from "../dto/createUser.dto";
import { User, UserRole } from "../entities/user.entity";

export interface IAuthRepository {
    createUser(data: {
        role?: UserRole,
        userName: string,
        password: string,
        phoneNumber: string,
        email: string,
        profile?: string,
    }): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    getAll(): Promise<User[]>;
    updatePassword(userId: number, newPassword: string): Promise<void>;


}