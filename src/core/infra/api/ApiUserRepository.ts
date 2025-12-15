import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Name } from '../../domain/value-objects/Name';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { api } from '@/services/axios';

export interface IAuth {
    access_token: string,
    token_type: string
}

export class ApiUserRepository implements IUserRepository {
    private static instance: ApiUserRepository;

    private constructor() { }

    public static getInstance(): ApiUserRepository {
        if (!ApiUserRepository.instance) {
            ApiUserRepository.instance = new ApiUserRepository();
        }
        return ApiUserRepository.instance;
    }

    async save(user: User): Promise<void> {
        await api.post('/users', {
            name: user.name.value,
            email: user.email.value,
            password: user.password.value,
        })
    }

    async findByEmail(email: string): Promise<User | null> {
        const response = await api.get(`users?email=${email}`)
        return response.data
    }

    async findById(id: string): Promise<User | null> {
        const response = await api.get(`users?email=${id}`)
        return response.data
    }

    async update(user: User): Promise<void> {
        await api.put(`/users/${user.id}`, {
            name: user.name.value,
            email: user.email.value,
            password: user.password.value,
        })
    }

    async delete(id: string): Promise<void> {
        await api.delete(`/users/${id}`)
    }

    async authenticate(email: string, password: string): Promise<IAuth> {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const response = await api.post("/token", formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        return response.data
    }
}
