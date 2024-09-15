import { User } from "../models/entity";

class UserQueryRepository {
  async getAllUsers(): Promise<Array<User>> {
    return User.findAll();
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return User.findOne({ where: { username } });
  }
}

export default new UserQueryRepository();
