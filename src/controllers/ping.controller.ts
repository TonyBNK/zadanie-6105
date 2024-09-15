import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../constants.js";
import ApiError from "../exceptions/api.error.js";

class PingController {
  async ping(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;

      if (Boolean(Object.keys(query).length)) {
        return next(
          ApiError.BadRequestError("Query parameters are not provided")
        );
      }

      res.status(HttpStatusCode.Success).send("ok");
    } catch (error) {
      next(error);
    }
  }
}

export default new PingController();
