import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import db from "../../db";
import { TenderServiceType, TenderStatus } from "../../types";

class Tender extends Model<
  InferAttributes<Tender>,
  InferCreationAttributes<Tender>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string;
  declare serviceType: TenderServiceType;
  declare status: TenderStatus;
  declare organizationId: string;
  declare creatorUsername: string;
  declare version: number;
  declare createdAt: Date;
}

Tender.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    serviceType: {
      type: DataTypes.ENUM(
        TenderServiceType.Construction,
        TenderServiceType.Delivery,
        TenderServiceType.Manufacture
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        TenderStatus.Created,
        TenderStatus.Published,
        TenderStatus.Closed
      ),
      defaultValue: TenderStatus.Created,
      allowNull: false,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    creatorUsername: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "tender", timestamps: false }
);

class TenderVersion extends Model<
  InferAttributes<TenderVersion>,
  InferCreationAttributes<TenderVersion>
> {
  declare id: CreationOptional<string>;
  declare tenderId: ForeignKey<Tender["id"]>;
  declare name: string;
  declare description: string;
  declare serviceType: TenderServiceType;
  declare version: number;
  declare createdAt: Date;
}

TenderVersion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Tender,
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    serviceType: {
      type: DataTypes.ENUM(
        TenderServiceType.Construction,
        TenderServiceType.Delivery,
        TenderServiceType.Manufacture
      ),
      allowNull: false,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "tender_version", timestamps: false }
);

Tender.hasMany(TenderVersion);
TenderVersion.belongsTo(Tender);

export { Tender, TenderVersion };
