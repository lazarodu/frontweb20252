import { IAuth } from "@/core/infra/api/ApiUserRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export class AuthUser {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(params: {
        email: string;
        password: string;
    }): Promise<IAuth> {
        const { email, password } = params;

        const user = await this.userRepository.authenticate(email, password);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        return user;
    }

}