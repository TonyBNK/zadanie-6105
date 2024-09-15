import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { HttpStatusCode } from "../constants";
import ApiError from "../exceptions/api.error";
import {
  CreateTenderInputModel,
  GetAllTendersQueryParams,
  GetTenderStatusQueryParams,
  GetUserTendersQueryParams,
  RollbackTenderParams,
  UpdateTenderBody,
  UpdateTenderStatusQueryParams,
} from "../models/input/tender.model";
import { TenderViewModel } from "../models/view/tender.model";
import tenderService from "../services/tender.service";
import {
  RequestWithBody,
  RequestWithParamsAndQuery,
  RequestWithParamsAndQueryAndBody,
  RequestWithQuery,
  TenderStatus,
} from "../types";
import { tenderToViewModel } from "../utility";

class TenderController {
  async createTender(
    req: RequestWithBody<CreateTenderInputModel>,
    res: Response<TenderViewModel>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const tender = await tenderService.createTender(req.body);

      res.status(HttpStatusCode.Created).send(tenderToViewModel(tender));
    } catch (error) {
      next(error);
    }
  }

  async getAllTenders(
    req: RequestWithQuery<GetAllTendersQueryParams>,
    res: Response<Array<TenderViewModel>>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const tenders = await tenderService.getAllTenders(req.query);

      res.status(HttpStatusCode.Success).send(tenders.map(tenderToViewModel));
    } catch (error) {
      next(error);
    }
  }

  async getUserTenders(
    req: RequestWithQuery<GetUserTendersQueryParams>,
    res: Response<Array<TenderViewModel>>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const tenders = await tenderService.getUserTenders(req.query);

      res.status(HttpStatusCode.Success).send(tenders.map(tenderToViewModel));
    } catch (error) {
      next(error);
    }
  }

  async getTenderStatus(
    req: RequestWithParamsAndQuery<
      { tenderId: string },
      GetTenderStatusQueryParams
    >,
    res: Response<TenderStatus>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const tenderStatus = await tenderService.getTenderStatus(
        req.params.tenderId,
        req.query.username
      );

      res.status(HttpStatusCode.Success).send(tenderStatus);
    } catch (error) {
      next(error);
    }
  }

  async updateTenderStatus(
    req: RequestWithParamsAndQuery<
      { tenderId: string },
      UpdateTenderStatusQueryParams
    >,
    res: Response<TenderViewModel>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const { tenderId } = req.params;
      const { status, username } = req.query;

      const tender = await tenderService.updateTenderStatus({
        tenderId,
        status,
        username,
      });

      res.status(HttpStatusCode.Success).send(tenderToViewModel(tender));
    } catch (error) {
      next(error);
    }
  }

  async updateTender(
    req: RequestWithParamsAndQueryAndBody<
      { tenderId: string },
      { username: string },
      UpdateTenderBody
    >,
    res: Response<TenderViewModel>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const { tenderId } = req.params;
      const { username } = req.query;

      const tender = await tenderService.updateTender({
        tenderId,
        username,
        payload: req.body,
      });

      res.status(HttpStatusCode.Success).send(tenderToViewModel(tender));
    } catch (error) {
      next(error);
    }
  }

  async rollbackTender(
    req: RequestWithParamsAndQuery<RollbackTenderParams, { username: string }>,
    res: Response<TenderViewModel>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const { tenderId, version } = req.params;
      const { username } = req.query;

      const tender = await tenderService.rollbackTender({
        tenderId,
        version,
        username,
      });

      res.status(HttpStatusCode.Success).send(tenderToViewModel(tender));
    } catch (error) {
      next(error);
    }
  }
}

export default new TenderController();
