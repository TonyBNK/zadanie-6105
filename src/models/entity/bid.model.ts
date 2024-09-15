import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import db from "../../db";
import { BidAuthorType, BidStatus } from "../../types";
import { Tender } from "./";

class Bid extends Model<InferAttributes<Bid>, InferCreationAttributes<Bid>> {
  [x: string]: any;
  declare id: CreationOptional<string>;
  declare name: string;
  declare description: string;
  declare status: BidStatus;
  declare tenderId: ForeignKey<Tender["id"]>;
  declare authorType: BidAuthorType;
  declare authorId: string;
  declare version: number;
  declare createdAt: Date;
}

Bid.init(
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
    status: {
      type: DataTypes.ENUM(
        BidStatus.Created,
        BidStatus.Published,
        BidStatus.Closed,
        BidStatus.Approved,
        BidStatus.Rejected
      ),
      defaultValue: BidStatus.Created,
      allowNull: false,
    },
    tenderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Tender,
        key: "id",
      },
    },
    authorType: {
      type: DataTypes.ENUM(BidAuthorType.Organization, BidAuthorType.User),
      allowNull: false,
    },
    authorId: {
      type: DataTypes.UUID,
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
  { sequelize: db, modelName: "bid", timestamps: false }
);

class BidVersion extends Model<
  InferAttributes<BidVersion>,
  InferCreationAttributes<BidVersion>
> {
  declare id: CreationOptional<string>;
  declare bidId: ForeignKey<Bid["id"]>;
  declare name: string;
  declare description: string;
  declare version: number;
  declare createdAt: Date;
}

BidVersion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    bidId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Bid,
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
  { sequelize: db, modelName: "bid_version", timestamps: false }
);

class BidReview extends Model<
  InferAttributes<BidReview>,
  InferCreationAttributes<BidReview>
> {
  declare id: CreationOptional<string>;
  declare bidId: ForeignKey<Bid["id"]>;
  declare description: string;
  declare createdAt: Date;
}

BidReview.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    bidId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Bid,
        key: "id",
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "bid_review", timestamps: false }
);

class BidDecision extends Model<
  InferAttributes<BidDecision>,
  InferCreationAttributes<BidDecision>
> {
  declare id: CreationOptional<string>;
  declare bidId: ForeignKey<Bid["id"]>;
  declare decision: string;
  declare createdAt: Date;
}

BidDecision.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    bidId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Bid,
        key: "id",
      },
    },
    decision: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "bid_decision", timestamps: false }
);

Bid.hasMany(BidVersion);
BidVersion.belongsTo(Bid);

Bid.hasMany(BidReview);
BidReview.belongsTo(Bid);

Bid.hasMany(BidDecision);
BidDecision.belongsTo(Bid);

export { Bid, BidDecision, BidReview, BidVersion };
