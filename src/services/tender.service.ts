import { v4 } from "uuid";
import ApiError from "../exceptions/api.error";
import { Tender } from "../models/entity";
import {
  CreateTenderInputModel,
  GetAllTendersQueryParams,
  GetUserTendersQueryParams,
  RollbackTenderInputModel,
  UpdateTenderInputModel,
  UpdateTenderStatusInputModel,
} from "../models/input/tender.model";
import organizationResponsibleQueryRepository from "../query-repositories/organization-responsible.query-repository";
import organizationQueryRepository from "../query-repositories/organization.query-repository";
import tenderQueryRepository from "../query-repositories/tender.query-repository";
import userQueryRepository from "../query-repositories/user.query-repository";
import tenderRepository from "../repositories/tender.repository";
import { TenderStatus } from "../types";
import { sortArray } from "../utility";

class TenderService {
  async createTender({
    name,
    description,
    serviceType,
    status,
    organizationId,
    creatorUsername,
  }: CreateTenderInputModel) {
    const isTenderExist = await tenderQueryRepository.getTenderByName(name);
    if (isTenderExist) {
      throw ApiError.BadRequestError(`Tender with name ${name} already exists`);
    }

    const user = await userQueryRepository.getUserByUsername(creatorUsername);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const organization = await organizationQueryRepository.getOrganizationById(
      organizationId
    );
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

    return tenderRepository.createTender({
      id: v4(),
      name,
      description,
      serviceType,
      status,
      organizationId,
      creatorUsername,
      createdAt: new Date(),
      version: 1,
    });
  }

  async getAllTenders(
    queryParams?: GetAllTendersQueryParams
  ): Promise<Array<Tender>> {
    const sortBy = "name";
    const sortDirection = "asc";

    const tenders = await tenderQueryRepository.getAllTenders(queryParams);

    return sortArray(tenders, sortBy, sortDirection);
  }

  async getUserTenders(
    queryParams: GetUserTendersQueryParams
  ): Promise<Array<Tender>> {
    if (!queryParams.username) {
      throw ApiError.UnauthorizedError();
    }

    const user = await userQueryRepository.getUserByUsername(
      queryParams.username
    );
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const tenders = await tenderQueryRepository.getUserTenders(queryParams);

    const sortBy = "name";
    const sortDirection = "asc";

    return sortArray(tenders, sortBy, sortDirection);
  }

  async getTenderStatus(id: string, username?: string): Promise<TenderStatus> {
    if (!username) {
      throw ApiError.UnauthorizedError();
    }

    const user = await userQueryRepository.getUserByUsername(username);
    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const tender = await tenderQueryRepository.getTenderById(id);
    if (!tender) {
      throw ApiError.NotFoundError("Such tender does not exist");
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

    return tender.status;
  }

  async updateTenderStatus({
    tenderId,
    status,
    username,
  }: UpdateTenderStatusInputModel): Promise<Tender> {
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

    const updatedTender = await tenderRepository.updateTender(tender, {
      status,
    });

    return updatedTender;
  }

  async updateTender({
    tenderId,
    username,
    payload,
  }: UpdateTenderInputModel): Promise<Tender> {
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

    await tenderRepository.createTenderVersion({
      id: v4(),
      tenderId: tender.id,
      name: tender.name,
      description: tender.description,
      serviceType: tender.serviceType,
      version: tender.version,
      createdAt: new Date(),
    });

    const updatedTender = await tenderRepository.updateTender(tender, {
      ...payload,
      version: tender.version + 1,
    });

    return updatedTender;
  }

  async rollbackTender({
    tenderId,
    version,
    username,
  }: RollbackTenderInputModel): Promise<Tender> {
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

    const oldVersion = await tenderQueryRepository.getTenderVersion(
      tenderId,
      version
    );
    if (!oldVersion) {
      throw ApiError.NotFoundError("Such version does not exist");
    }

    await tenderRepository.createTenderVersion({
      id: v4(),
      tenderId: tender.id,
      name: tender.name,
      description: tender.description,
      serviceType: tender.serviceType,
      version: tender.version,
      createdAt: new Date(),
    });

    const updatedTender = await tenderRepository.updateTender(tender, {
      name: oldVersion.name,
      description: oldVersion.description,
      serviceType: oldVersion.serviceType,
      version: tender.version + 1,
    });

    return updatedTender;
  }
}

export default new TenderService();
