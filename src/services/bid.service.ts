import { v4 } from "uuid";
import ApiError from "../exceptions/api.error";
import { Bid, BidReview } from "../models/entity";
import {
  CreateBidInputModel,
  FeedbackBidInputModel,
  GetBidReviewsInputModel,
  GetTenderBidsInputModel,
  GetUserBidsQueryParams,
  RollbackBidInputModel,
  SubmitDecisionInputModel,
  UpdateBidInputModel,
  UpdateBidStatusInputModel,
} from "../models/input/bid.model";
import bidQueryRepository from "../query-repositories/bid.query-repository";
import organizationResponsibleQueryRepository from "../query-repositories/organization-responsible.query-repository";
import organizationQueryRepository from "../query-repositories/organization.query-repository";
import tenderQueryRepository from "../query-repositories/tender.query-repository";
import userQueryRepository from "../query-repositories/user.query-repository";
import bidRepository from "../repositories/bid.repository";
import tenderRepository from "../repositories/tender.repository";
import { BidAuthorType, BidStatus, TenderStatus } from "../types";
import { sortArray } from "../utility";

class BidService {
  async createBid({
    name,
    description,
    status,
    tenderId,
    organizationId,
    creatorUsername,
  }: CreateBidInputModel) {
    const tender = await tenderQueryRepository.getTenderById(tenderId);
    if (!tender) {
      throw ApiError.NotFoundError("Such tender does not exist");
    }

    const isBidExist = await bidQueryRepository.getBidByNameAndTenderId(
      name,
      tenderId
    );
    if (isBidExist) {
      throw ApiError.BadRequestError(
        `Bid with name ${name} already exists in this tender `
      );
    }

    const user = await userQueryRepository.getUserByUsername(creatorUsername);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const isOrganizationResponsible =
      await organizationResponsibleQueryRepository.getOrganizationResponsible(
        tender.organizationId,
        user.id
      );
    if (
      !isOrganizationResponsible &&
      tender.status !== TenderStatus.Published
    ) {
      throw ApiError.ForbiddenError();
    }

    let authorType = BidAuthorType.User;
    let authorId = user.id;

    if (organizationId) {
      const organization =
        await organizationQueryRepository.getOrganizationById(organizationId);
      if (!organization) {
        throw ApiError.NotFoundError("Such organization does not exist");
      }

      const isOrganizationResponsible =
        await organizationResponsibleQueryRepository.getOrganizationResponsible(
          organizationId,
          user.id
        );
      if (!isOrganizationResponsible) {
        throw ApiError.ForbiddenError();
      }

      authorType = BidAuthorType.Organization;
      authorId = organizationId;
    }

    return bidRepository.createBid({
      id: v4(),
      name,
      description,
      status,
      tenderId,
      authorId,
      authorType,
      createdAt: new Date(),
      version: 1,
    });
  }

  async getUserBids(queryParams: GetUserBidsQueryParams): Promise<Array<Bid>> {
    if (!queryParams.username) {
      throw ApiError.UnauthorizedError();
    }

    const user = await userQueryRepository.getUserByUsername(
      queryParams.username
    );
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const bids = await bidQueryRepository.getUserBids({
      authorId: user.id,
      offset: queryParams.offset,
      limit: queryParams.limit,
    });

    const sortBy = "name";
    const sortDirection = "asc";

    return sortArray(bids, sortBy, sortDirection);
  }

  async getTenderBids({
    tenderId,
    username,
    offset,
    limit,
  }: GetTenderBidsInputModel): Promise<Array<Bid>> {
    const user = await userQueryRepository.getUserByUsername(username);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const tender = await tenderQueryRepository.getTenderById(tenderId);
    if (!tender) {
      throw ApiError.NotFoundError("Such tender does not exist");
    }

    const isOrganizationResponsible =
      await organizationResponsibleQueryRepository.getOrganizationResponsible(
        tender.organizationId,
        user.id
      );
    if (!isOrganizationResponsible) {
      throw ApiError.ForbiddenError();
    }

    const bids = await bidQueryRepository.getTenderBids({
      tenderId,
      offset,
      limit,
    });

    const sortBy = "name";
    const sortDirection = "asc";

    return sortArray(bids, sortBy, sortDirection);
  }

  async getBidStatus(id: string, username: string): Promise<BidStatus> {
    const user = await userQueryRepository.getUserByUsername(username);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const bid = await bidQueryRepository.getBidById(id);
    if (!bid) {
      throw ApiError.NotFoundError("Such bid does not exist");
    }

    if (bid.authorType === BidAuthorType.Organization) {
      const isOrganizationResponsible =
        await organizationResponsibleQueryRepository.getOrganizationResponsible(
          bid.authorId,
          user.id
        );

      if (!isOrganizationResponsible && bid.status !== BidStatus.Published) {
        throw ApiError.ForbiddenError();
      }
    } else {
      if (bid.authorId !== user.id && bid.status !== BidStatus.Published) {
        throw ApiError.ForbiddenError();
      }
    }

    return bid.status;
  }

  async updateBidStatus({
    bidId,
    status,
    username,
  }: UpdateBidStatusInputModel): Promise<Bid> {
    const user = await userQueryRepository.getUserByUsername(username);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const bid = await bidQueryRepository.getBidById(bidId);
    if (!bid) {
      throw ApiError.NotFoundError("Such bid does not exist");
    }

    if (bid.authorType === BidAuthorType.Organization) {
      const isOrganizationResponsible =
        await organizationResponsibleQueryRepository.getOrganizationResponsible(
          bid.authorId,
          user.id
        );

      if (!isOrganizationResponsible) {
        throw ApiError.ForbiddenError();
      }
    } else {
      if (bid.authorId !== user.id) {
        throw ApiError.ForbiddenError();
      }
    }

    const updatedBid = await bidRepository.updateBid(bid, {
      status,
    });

    return updatedBid;
  }

  async updateBid({
    bidId,
    username,
    payload,
  }: UpdateBidInputModel): Promise<Bid> {
    const user = await userQueryRepository.getUserByUsername(username);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const bid = await bidQueryRepository.getBidById(bidId);
    if (!bid) {
      throw ApiError.NotFoundError("Such bid does not exist");
    }

    if (bid.authorType === BidAuthorType.Organization) {
      const isOrganizationResponsible =
        await organizationResponsibleQueryRepository.getOrganizationResponsible(
          bid.authorId,
          user.id
        );

      if (!isOrganizationResponsible) {
        throw ApiError.ForbiddenError();
      }
    } else {
      if (bid.authorId !== user.id) {
        throw ApiError.ForbiddenError();
      }
    }

    await bidRepository.createBidVersion({
      id: v4(),
      bidId: bid.id,
      name: bid.name,
      description: bid.description,
      version: bid.version,
      createdAt: new Date(),
    });

    const updatedBid = await bidRepository.updateBid(bid, {
      ...payload,
      version: bid.version + 1,
    });

    return updatedBid;
  }

  async rollbackBid({
    bidId,
    version,
    username,
  }: RollbackBidInputModel): Promise<Bid> {
    const user = await userQueryRepository.getUserByUsername(username);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const bid = await bidQueryRepository.getBidById(bidId);
    if (!bid) {
      throw ApiError.NotFoundError("Such bid does not exist");
    }

    if (bid.authorType === BidAuthorType.Organization) {
      const isOrganizationResponsible =
        await organizationResponsibleQueryRepository.getOrganizationResponsible(
          bid.authorId,
          user.id
        );

      if (!isOrganizationResponsible) {
        throw ApiError.ForbiddenError();
      }
    } else {
      if (bid.authorId !== user.id) {
        throw ApiError.ForbiddenError();
      }
    }

    const oldVersion = await bidQueryRepository.getBidVersion(bidId, version);
    if (!oldVersion) {
      throw ApiError.NotFoundError("Such version does not exist");
    }

    await bidRepository.createBidVersion({
      id: v4(),
      bidId: bid.id,
      name: bid.name,
      description: bid.description,
      version: bid.version,
      createdAt: new Date(),
    });

    const updatedBid = await bidRepository.updateBid(bid, {
      name: oldVersion.name,
      description: oldVersion.description,
      version: bid.version + 1,
    });

    return updatedBid;
  }

  async feedbackBid({
    bidId,
    bidFeedback,
    username,
  }: FeedbackBidInputModel): Promise<Bid> {
    const user = await userQueryRepository.getUserByUsername(username);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const bid = await bidQueryRepository.getBidById(bidId);
    if (!bid) {
      throw ApiError.NotFoundError("Such bid does not exist");
    }

    const tender = await tenderQueryRepository.getTenderById(bid.tenderId);
    if (!tender) {
      throw ApiError.NotFoundError("Such tender does not exist");
    }

    const isOrganizationResponsible =
      await organizationResponsibleQueryRepository.getOrganizationResponsible(
        tender.organizationId,
        user.id
      );
    if (!isOrganizationResponsible) {
      throw ApiError.ForbiddenError();
    }

    await bidRepository.createBidReview({
      id: v4(),
      bidId: bid.id,
      description: bidFeedback,
      createdAt: new Date(),
    });

    return bid;
  }

  async getReviews({
    tenderId,
    authorUsername,
    requesterUsername,
    limit,
    offset,
  }: GetBidReviewsInputModel): Promise<Array<BidReview>> {
    const user = await userQueryRepository.getUserByUsername(requesterUsername);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const tender = await tenderQueryRepository.getTenderById(tenderId);
    if (!tender) {
      throw ApiError.NotFoundError("Such tender does not exist");
    }

    const author = await userQueryRepository.getUserByUsername(authorUsername);
    if (!author) {
      throw ApiError.NotFoundError("Such author does not exist");
    }

    const isOrganizationResponsible =
      await organizationResponsibleQueryRepository.getOrganizationResponsible(
        tender.organizationId,
        user.id
      );
    if (!isOrganizationResponsible) {
      throw ApiError.ForbiddenError();
    }

    let reviews = await bidQueryRepository.getReviews({
      authorId: author.id,
      limit,
      offset,
    });

    const authorOrganization =
      await organizationResponsibleQueryRepository.getEmployeeOrganization(
        author.id
      );
    if (authorOrganization) {
      const organizationReviews = await bidQueryRepository.getReviews({
        authorId: authorOrganization.id,
        limit,
        offset,
      });
      reviews = [...reviews, ...organizationReviews];
    }

    return sortArray(reviews, "createdAt", "asc");
  }

  async submitDecision({
    bidId,
    decision,
    username,
  }: SubmitDecisionInputModel): Promise<Bid> {
    const user = await userQueryRepository.getUserByUsername(username);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    let bid = await bidQueryRepository.getBidById(bidId);
    if (!bid) {
      throw ApiError.NotFoundError("Such bid does not exist");
    }

    const tender = await tenderQueryRepository.getTenderById(bid.tenderId);
    if (!tender) {
      throw ApiError.NotFoundError("Such tender does not exist");
    }

    const isOrganizationResponsible =
      await organizationResponsibleQueryRepository.getOrganizationResponsible(
        tender.organizationId,
        user.id
      );
    if (!isOrganizationResponsible) {
      throw ApiError.ForbiddenError();
    }

    await bidRepository.createBidDecision({
      id: v4(),
      bidId: bid.id,
      decision,
      createdAt: new Date(),
    });

    if (decision === BidStatus.Rejected) {
      bid = await bidRepository.updateBid(bid, {
        status: BidStatus.Rejected,
      });
    }

    if (decision === BidStatus.Approved) {
      const approvedCount = await bidQueryRepository.getApprovedDecisionCount(
        bid.id
      );

      if (approvedCount >= 3) {
        [bid] = await Promise.all([
          bidRepository.updateBid(bid, {
            status: BidStatus.Approved,
          }),
          tenderRepository.updateTender(tender, {
            status: TenderStatus.Closed,
          }),
        ]);
      }
    }

    return bid;
  }
}

export default new BidService();
