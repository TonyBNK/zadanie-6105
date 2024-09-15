import { User } from "../models/entity";

type CreateUserParams = {
  username: string;
  firstName: string;
  lastName: string;
};

class UserRepository {
  async createUser({
    username,
    firstName,
    lastName,
  }: CreateUserParams): Promise<User> {
    const user = User.build({
      username,
      first_name: firstName,
      last_name: lastName,
    });
    await user.save();

    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await User.destroy({ where: { id } });
  }
}

export default new UserRepository();
