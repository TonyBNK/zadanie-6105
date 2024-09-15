import { Tender, TenderVersion } from "../models/entity";
import {
  GetAllTendersQueryParams,
  GetUserTendersQueryParams,
} from "../models/input/tender.model.js";
import { TenderServiceType } from "../types.js";

class TenderQueryRepository {
  async getAllTenders(
    queryParams?: GetAllTendersQueryParams
  ): Promise<Array<Tender>> {
    const filter: { serviceType?: TenderServiceType } = {};

    const limit = queryParams?.limit || 5;
    const offset = queryParams?.offset || 0;
    const serviceType = queryParams?.service_type;

    if (serviceType) {
      filter.serviceType = serviceType;
    }

    return Tender.findAll({
      where: filter,
      limit,
      offset,
    });
  }

  async getTenderById(id: string): Promise<Tender | null> {
    return Tender.findOne({ where: { id } });
  }

  async getTenderByName(name: string): Promise<Tender | null> {
    return Tender.findOne({ where: { name } });
  }

  async getUserTenders(
    queryParams: GetUserTendersQueryParams
  ): Promise<Array<Tender>> {
    const limit = queryParams.limit || 5;
    const offset = queryParams.offset || 0;

    return Tender.findAll({
      where: { creatorUsername: queryParams.username },
      limit,
      offset,
    });
  }

  async getTenderVersion(
    tenderId: string,
    version: number
  ): Promise<TenderVersion | null> {
    return TenderVersion.findOne({ where: { tenderId, version } });
  }
}

export default new TenderQueryRepository();
