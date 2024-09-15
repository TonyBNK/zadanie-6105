import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { HttpStatusCode } from "../constants";
import ApiError from "../exceptions/api.error";
import {
  CreateBidInputModel,
  FeedbackBidQueryParams,
  GetBidReviewsQueryParams,
  GetBidStatusQueryParams,
  GetTenderBidsQueryParams,
  GetUserBidsQueryParams,
  RollbackBidParams,
  SubmitDecisionQueryParams,
  UpdateBidBody,
  UpdateBidStatusQueryParams,
} from "../models/input/bid.model";
import { BidReviewViewModel, BidViewModel } from "../models/view/bid.model";
import bidService from "../services/bid.service";
import {
  BidStatus,
  RequestWithBody,
  RequestWithParamsAndQuery,
  RequestWithParamsAndQueryAndBody,
  RequestWithQuery,
} from "../types";
import { bidReviewToViewModel, bidToViewModel } from "../utility";

class BidController {
  async createBid(
    req: RequestWithBody<CreateBidInputModel>,
    res: Response<BidViewModel>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const bid = await bidService.createBid(req.body);

      res.status(HttpStatusCode.Created).send(bidToViewModel(bid));
    } catch (error) {
      next(error);
    }
  }

  async getUserBids(
    req: RequestWithQuery<GetUserBidsQueryParams>,
    res: Response<Array<BidViewModel>>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const bids = await bidService.getUserBids(req.query);

      res.status(HttpStatusCode.Success).send(bids.map(bidToViewModel));
    } catch (error) {
      next(error);
    }
  }

  async getTenderBids(
    req: RequestWithParamsAndQuery<
      { tenderId: string },
      GetTenderBidsQueryParams
    >,
    res: Response<Array<BidViewModel>>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const { username, limit, offset } = req.query;
      const { tenderId } = req.params;

      const bids = await bidService.getTenderBids({
        tenderId,
        username,
        limit,
        offset,
      });

      res.status(HttpStatusCode.Success).send(bids.map(bidToViewModel));
    } catch (error) {
      next(error);
    }
  }

  async getBidStatus(
    req: RequestWithParamsAndQuery<{ bidId: string }, GetBidStatusQueryParams>,
    res: Response<BidStatus>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const bidStatus = await bidService.getBidStatus(
        req.params.bidId,
        req.query.username
      );

      res.status(HttpStatusCode.Success).send(bidStatus);
    } catch (error) {
      next(error);
    }
  }

  async updateBidStatus(
    req: RequestWithParamsAndQuery<
      { bidId: string },
      UpdateBidStatusQueryParams
    >,
    res: Response<BidViewModel>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const { bidId } = req.params;
      const { status, username } = req.query;

      const bid = await bidService.updateBidStatus({
        bidId,
        status,
        username,
      });

      res.status(HttpStatusCode.Success).send(bidToViewModel(bid));
    } catch (error) {
      next(error);
    }
  }

  async updateBid(
    req: RequestWithParamsAndQueryAndBody<
      { bidId: string },
      { username: string },
      UpdateBidBody
    >,
    res: Response<BidViewModel>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const { bidId } = req.params;
      const { username } = req.query;

      const bid = await bidService.updateBid({
        bidId,
        username,
        payload: req.body,
      });

      res.status(HttpStatusCode.Success).send(bidToViewModel(bid));
    } catch (error) {
      next(error);
    }
  }

  async rollbackBid(
    req: RequestWithParamsAndQuery<RollbackBidParams, { username: string }>,
    res: Response<BidViewModel>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const { bidId, version } = req.params;
      const { username } = req.query;

      const bid = await bidService.rollbackBid({
        bidId,
        version,
        username,
      });

      res.status(HttpStatusCode.Success).send(bidToViewModel(bid));
    } catch (error) {
      next(error);
    }
  }

  async feedbackBid(
    req: RequestWithParamsAndQuery<{ bidId: string }, FeedbackBidQueryParams>,
    res: Response<BidViewModel>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const { bidId } = req.params;
      const { bidFeedback, username } = req.query;

      const bid = await bidService.feedbackBid({
        bidId,
        bidFeedback,
        username,
      });

      res.status(HttpStatusCode.Success).send(bidToViewModel(bid));
    } catch (error) {
      next(error);
    }
  }

  async getReviews(
    req: RequestWithParamsAndQuery<
      { tenderId: string },
      GetBidReviewsQueryParams
    >,
    res: Response<Array<BidReviewViewModel>>,
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
      const { authorUsername, requesterUsername, limit, offset } = req.query;

      const bidReviews = await bidService.getReviews({
        tenderId,
        authorUsername,
        requesterUsername,
        limit,
        offset,
      });

      res
        .status(HttpStatusCode.Success)
        .send(bidReviews.map(bidReviewToViewModel));
    } catch (error) {
      next(error);
    }
  }

  async submitDecision(
    req: RequestWithParamsAndQuery<
      { bidId: string },
      SubmitDecisionQueryParams
    >,
    res: Response<BidViewModel>,
    next: NextFunction
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation error", errors.array())
        );
      }

      const { bidId } = req.params;
      const { decision, username } = req.query;

      const bid = await bidService.submitDecision({
        bidId,
        decision,
        username,
      });

      res.status(HttpStatusCode.Success).send(bidToViewModel(bid));
    } catch (error) {
      next(error);
    }
  }
}

export default new BidController();
