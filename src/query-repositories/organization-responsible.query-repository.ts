import { Organization, OrganizationResponsible, User } from "../models/entity";

class OrganizationResponsibleQueryRepository {
  async getAllOrganizationResponsibles(): Promise<
    Array<OrganizationResponsible>
  > {
    return OrganizationResponsible.findAll();
  }

  async getOrganizationResponsible(
    organizationId: string,
    userId: string
  ): Promise<OrganizationResponsible | null> {
    return OrganizationResponsible.findOne({
      where: { organization_id: organizationId, user_id: userId },
    });
  }

  async getOrganizationResponsibles(
    organizationId: string
  ): Promise<Array<User>> {
    const organizationResponsibles = await OrganizationResponsible.findAll({
      where: {
        organization_id: organizationId,
      },
      include: [
        {
          model: User,
          as: "employee",
        },
      ],
    });

    return organizationResponsibles.map((or) => or.employee);
  }

  async getEmployeeOrganization(userId: string): Promise<Organization | null> {
    const organizationResponsible = await OrganizationResponsible.findOne({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: Organization,
          as: "organization",
        },
      ],
    });

    return organizationResponsible?.organization || null;
  }
}

export default new OrganizationResponsibleQueryRepository();
