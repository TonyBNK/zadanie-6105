import {
  Bid,
  BidDecision,
  BidReview,
  BidVersion,
} from "../models/entity/bid.model";
import {
  GetReviewsInputForDB,
  GetTenderBidsInputForDB,
  GetUserBidsInputForDB,
} from "../models/input/bid.model";
import { GetAllTendersQueryParams } from "../models/input/tender.model";
import { BidStatus, TenderServiceType } from "../types";

class BidQueryRepository {
  async getAllBids(
    queryParams?: GetAllTendersQueryParams
  ): Promise<Array<Bid>> {
    const filter: { serviceType?: TenderServiceType } = {};

    const limit = queryParams?.limit || 5;
    const offset = queryParams?.offset || 0;
    const serviceType = queryParams?.service_type;

    if (serviceType) {
      filter.serviceType = serviceType;
    }

    return Bid.findAll({
      where: filter,
      limit,
      offset,
    });
  }

  async getBidById(id: string): Promise<Bid | null> {
    return Bid.findOne({ where: { id } });
  }

  async getBidByNameAndTenderId(
    name: string,
    tenderId: string
  ): Promise<Bid | null> {
    return Bid.findOne({ where: { name, tenderId } });
  }

  async getUserBids({
    limit = 5,
    offset = 0,
    authorId,
  }: GetUserBidsInputForDB): Promise<Array<Bid>> {
    return Bid.findAll({
      where: { authorId },
      limit,
      offset,
    });
  }

  async getTenderBids({
    limit = 5,
    offset = 0,
    tenderId,
  }: GetTenderBidsInputForDB): Promise<Array<Bid>> {
    return Bid.findAll({
      where: { tenderId },
      limit,
      offset,
    });
  }

  async getBidVersion(
    bidId: string,
    version: number
  ): Promise<BidVersion | null> {
    return BidVersion.findOne({ where: { bidId, version } });
  }

  async getReviews({
    authorId,
    limit = 5,
    offset = 0,
  }: GetReviewsInputForDB): Promise<Array<BidReview>> {
    const bids = await Bid.findAll({
      where: {
        authorId,
      },
      limit,
      offset,
      include: [BidReview],
    });

    return bids.flatMap((bid) => bid.bid_reviews);
  }

  async getApprovedDecisionCount(bidId: string): Promise<number> {
    return BidDecision.count({
      where: { bidId, decision: BidStatus.Approved },
    });
  }
}

export default new BidQueryRepository();
