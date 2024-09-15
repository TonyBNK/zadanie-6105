import { Bid, BidVersion } from "../models/entity";
import { BidDecision, BidReview } from "../models/entity/bid.model";
import {
  BidInputForDB,
  CreateBidDecisionInputModel,
  CreateBidReviewInputModel,
  CreateBidVersionInputModel,
} from "../models/input/bid.model";

class BidRepository {
  async createBid({
    id,
    name,
    description,
    status,
    tenderId,
    authorId,
    authorType,
    createdAt,
    version,
  }: BidInputForDB): Promise<Bid> {
    const bid = Bid.build({
      id,
      name,
      description,
      status,
      tenderId,
      authorId,
      authorType,
      createdAt,
      version,
    });
    await bid.save();

    return bid;
  }

  async updateBid(bid: Bid, payload: Partial<BidInputForDB>): Promise<Bid> {
    return bid.update(payload);
  }

  async createBidVersion({
    id,
    bidId,
    name,
    description,
    createdAt,
    version,
  }: CreateBidVersionInputModel): Promise<void> {
    const bidVersion = BidVersion.build({
      id,
      bidId,
      name,
      description,
      createdAt,
      version,
    });
    await bidVersion.save();
  }

  async createBidReview({
    id,
    bidId,
    description,
    createdAt,
  }: CreateBidReviewInputModel): Promise<void> {
    const bidReview = BidReview.build({
      id,
      bidId,
      description,
      createdAt,
    });
    await bidReview.save();
  }

  async createBidDecision({
    id,
    bidId,
    decision,
    createdAt,
  }: CreateBidDecisionInputModel): Promise<void> {
    const bidDecision = BidDecision.build({
      id,
      bidId,
      decision,
      createdAt,
    });
    await bidDecision.save();
  }
}

export default new BidRepository();
