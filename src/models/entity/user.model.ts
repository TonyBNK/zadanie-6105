import { CreationOptional, DataTypes, Model, Optional } from "sequelize";
import db from "../../db";

interface UserAttributes {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "created_at" | "updated_at"> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: CreationOptional<string>;
  declare username: string;
  declare first_name: string;
  declare last_name: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  get firstName(): string {
    return this.get("first_name");
  }

  set firstName(value: string) {
    this.set("first_name", value);
  }

  get lastName(): string {
    return this.get("last_name");
  }

  set lastName(value: string) {
    this.set("last_name", value);
  }

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

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
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
    modelName: "employee",
    timestamps: false,
    tableName: "employee",
  }
);

export { User };
