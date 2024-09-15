import { BidAuthorType, BidStatus } from "../../types";

export type BidViewModel = {
  id: string;
  name: string;
  description: string;
  status: BidStatus;
  tenderId: string;
  authorId: string;
  authorType: BidAuthorType;
  version: number;
  createdAt: string;
};

export type BidReviewViewModel = {
  id: string;
  description: string;
  createdAt: string;
};
