import { DataTypes, Model, Optional } from "sequelize";
import db from "../../db";
import { Organization } from "./organization.model";
import { User } from "./user.model";

interface OrganizationResponsibleAttributes {
  id: string;
  organization_id: string;
  user_id: string;
}

interface OrganizationResponsibleCreationAttributes
  extends Optional<OrganizationResponsibleAttributes, "id"> {}

class OrganizationResponsible extends Model<
  OrganizationResponsibleAttributes,
  OrganizationResponsibleCreationAttributes
> {
  [x: string]: any;
  declare id: string;
  declare organization_id: string;
  declare user_id: string;
  declare organization: Organization;
  declare user: User;

  get organizationId(): string {
    return this.get("organization_id");
  }

  set organizationId(value: string) {
    this.set("organization_id", value);
  }

  get userId(): string {
    return this.get("user_id");
  }

  set userId(value: string) {
    this.set("user_id", value);
  }
}

OrganizationResponsible.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    organization_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Organization,
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize: db,
    modelName: "organization_responsible",
    timestamps: false,
    tableName: "organization_responsible",
  }
);

export { OrganizationResponsible };
