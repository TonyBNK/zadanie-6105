import { Organization } from "../models/entity";

class OrganizationQueryRepository {
  async getAllOrganizations(): Promise<Array<Organization>> {
    return Organization.findAll();
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    return Organization.findOne({ where: { id } });
  }
}

export default new OrganizationQueryRepository();
