import { Organization } from "../models/entity";
import { OrganizationType } from "../models/entity/organization.model";

type CreateOrganizationParams = {
  name: string;
  description: string;
  type: OrganizationType;
};

class OrganizationRepository {
  async createOrganization({
    name,
    type,
    description,
  }: CreateOrganizationParams): Promise<Organization> {
    const organization = Organization.build({
      name,
      description,
      type,
    });
    await organization.save();

    return organization;
  }

  async deleteOrganization(id: string): Promise<void> {
    await Organization.destroy({ where: { id } });
  }
}

export default new OrganizationRepository();
