import { IUserRepository } from '../domain/repositories/IUserRepository';
import { DeleteUser } from '../domain/use-cases/DeleteUser';
import { FindUser } from '../domain/use-cases/FindUser';
import { FindUserByEmail } from '../domain/use-cases/FindUserByEmail';
import { LoginUser } from '../domain/use-cases/LoginUser';
import { RegisterUser } from '../domain/use-cases/RegisterUser';
import { UpdateUser } from '../domain/use-cases/UpdateUser';
import { AuthUser } from '../domain/use-cases/AuthUser'
import { MockUserRepository } from '../infra/mocks/MockUserRepository';
import { ApiUserRepository } from '../infra/api/ApiUserRepository'

export function makeUserUseCases() {
  const userRepository: IUserRepository = process.env.NEXT_PUBLIC_USE_API === 'true'
    ? ApiUserRepository.getInstance()
    : MockUserRepository.getInstance();

  const registerUser = new RegisterUser(userRepository);
  const loginUser = new LoginUser(userRepository);
  const updateUser = new UpdateUser(userRepository);
  const deleteUser = new DeleteUser(userRepository);
  const findUser = new FindUser(userRepository);
  const findUserByEmail = new FindUserByEmail(userRepository);
  const authUser = new AuthUser(userRepository);

  return {
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    findUser,
    findUserByEmail,
    authUser
  };
}
