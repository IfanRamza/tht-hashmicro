import type { User } from "../models";
import { userRepository } from "../repositories/UserRepository";

type UserRepositoryPort = {
  findByUsername(username: string): User | undefined;
};

type AuthServiceDependencies = {
  userRepository: UserRepositoryPort;
};

export function createAuthService(dependencies: AuthServiceDependencies) {
  const { userRepository } = dependencies;

  return {
    authenticate(username: string | undefined, password: string | undefined) {
      const user = username ? userRepository.findByUsername(username) : undefined;

      if (!user || user.getPasswordHash() !== password) {
        return null;
      }

      return user;
    },
  };
}

export type AuthService = ReturnType<typeof createAuthService>;

export const authService = createAuthService({
  userRepository,
});
