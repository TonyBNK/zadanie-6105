import { OrganizationResponsible } from "../models/entity";

type CreateOrganizationResponsibleParams = {
  organizationId: string;
  userId: string;
};

class OrganizationResponsibleRepository {
  async createOrganizationResponsible({
    organizationId,
    userId,
  }: CreateOrganizationResponsibleParams): Promise<OrganizationResponsible> {
    const organizationResponsible = OrganizationResponsible.build({
      user_id: userId,
      organization_id: organizationId,
    });
    await organizationResponsible.save();

    return organizationResponsible;
  }

  async deleteOrganizationResponsible(id: string): Promise<void> {
    await OrganizationResponsible.destroy({ where: { id } });
  }
}

export default new OrganizationResponsibleRepository();
