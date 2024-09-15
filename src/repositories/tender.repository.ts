import { Tender, TenderVersion } from "../models/entity";
import {
  CreateTenderVersionInputModel,
  TenderInputForDB,
} from "../models/input/tender.model";

class TenderRepository {
  async createTender({
    id,
    name,
    description,
    serviceType,
    creatorUsername,
    organizationId,
    status,
    createdAt,
    version,
  }: TenderInputForDB): Promise<Tender> {
    const tender = Tender.build({
      id,
      name,
      description,
      serviceType,
      creatorUsername,
      organizationId,
      status,
      createdAt,
      version,
    });
    await tender.save();

    return tender;
  }

  async updateTender(
    tender: Tender,
    payload: Partial<TenderInputForDB>
  ): Promise<Tender> {
    return tender.update(payload);
  }

  async createTenderVersion({
    id,
    tenderId,
    name,
    description,
    serviceType,
    createdAt,
    version,
  }: CreateTenderVersionInputModel): Promise<void> {
    const tenderVersion = TenderVersion.build({
      id,
      tenderId,
      name,
      description,
      serviceType,
      createdAt,
      version,
    });
    await tenderVersion.save();
  }
}

export default new TenderRepository();
