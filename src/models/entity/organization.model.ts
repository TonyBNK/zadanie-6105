import { CreationOptional, DataTypes, Model, Optional } from "sequelize";
import db from "../../db";

export type OrganizationType = "IE" | "LLC" | "JSC";

interface OrganizationAttributes {
  id: string;
  name: string;
  description: string;
  type: OrganizationType;
  created_at?: Date;
  updated_at?: Date;
}

interface OrganizationCreationAttributes
  extends Optional<
    OrganizationAttributes,
    "id" | "created_at" | "updated_at"
  > {}

class Organization extends Model<
  OrganizationAttributes,
  OrganizationCreationAttributes
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string;
  declare type: OrganizationType;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  get createdAt(): Date {
    return this.get("created_at");
  }

  set createdAt(value: Date) {
    this.set("created_at", value);
  }

  get updatedAt(): Date {
    return this.get("updated_at");
  }

  set updatedAt(value: Date) {
    this.set("updated_at", value);
  }
}

Organization.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("IE", "LLC", "JSC"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "organization",
    timestamps: false,
    tableName: "organization",
  }
);

export { Organization };
