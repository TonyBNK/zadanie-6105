import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../constants";
import userQueryRepository from "../query-repositories/user.query-repository";
import userRepository from "../repositories/user.repository";

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userRepository.createUser(req.body);

      res.status(HttpStatusCode.Success).send(user);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userQueryRepository.getAllUsers();

      res.status(HttpStatusCode.Success).send(users);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userRepository.deleteUser(req.params.id);

      res.sendStatus(HttpStatusCode.NoContent);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
