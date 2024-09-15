import { BidAuthorType, BidStatus } from "../../types";

export type CreateBidInputModel = {
  name: string;
  description: string;
  status: BidStatus.Created | BidStatus.Published | BidStatus.Closed;
  tenderId: string;
  organizationId?: string;
  creatorUsername: string;
};

export type BidInputForDB = {
  id: string;
  createdAt: Date;
  version: number;
  name: string;
  description: string;
  status: BidStatus;
  tenderId: string;
  authorType: BidAuthorType;
  authorId: string;
};

export type GetUserBidsQueryParams = {
  username?: string;
  limit?: number;
  offset?: number;
};

export type GetUserBidsInputForDB = {
  authorId: string;
  limit?: number;
  offset?: number;
};

export type GetTenderBidsQueryParams = {
  username: string;
  limit?: number;
  offset?: number;
};

export type GetTenderBidsInputModel = {
  tenderId: string;
  username: string;
  limit?: number;
  offset?: number;
};

export type GetTenderBidsInputForDB = {
  tenderId: string;
  limit?: number;
  offset?: number;
};

export type GetBidStatusQueryParams = {
  username: string;
};

export type UpdateBidStatusQueryParams = {
  username: string;
  status: BidStatus.Created | BidStatus.Published | BidStatus.Closed;
};

export type UpdateBidStatusInputModel = {
  bidId: string;
  status: BidStatus.Created | BidStatus.Published | BidStatus.Closed;
  username: string;
};

export type UpdateBidBody = {
  name?: string;
  description?: string;
};

export type UpdateBidInputModel = {
  bidId: string;
  username: string;
  payload: UpdateBidBody;
};

export type CreateBidVersionInputModel = {
  id: string;
  bidId: string;
  name: string;
  description: string;
  version: number;
  createdAt: Date;
};

export type RollbackBidParams = {
  bidId: string;
  version: number;
};

export type RollbackBidInputModel = RollbackBidParams & {
  username: string;
};

export type FeedbackBidQueryParams = {
  bidFeedback: string;
  username: string;
};

export type FeedbackBidInputModel = FeedbackBidQueryParams & {
  bidId: string;
};

export type CreateBidReviewInputModel = {
  id: string;
  bidId: string;
  description: string;
  createdAt: Date;
};

export type GetBidReviewsQueryParams = {
  authorUsername: string;
  requesterUsername: string;
  limit?: number;
  offset?: number;
};

export type GetBidReviewsInputModel = GetBidReviewsQueryParams & {
  tenderId: string;
};

export type GetReviewsInputForDB = {
  authorId: string;
  limit?: number;
  offset?: number;
};

export type SubmitDecisionQueryParams = {
  decision: BidStatus.Approved | BidStatus.Rejected;
  username: string;
};

export type SubmitDecisionInputModel = SubmitDecisionQueryParams & {
  bidId: string;
};

export type CreateBidDecisionInputModel = {
  id: string;
  bidId: string;
  decision: string;
  createdAt: Date;
};
