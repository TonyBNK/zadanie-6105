import { Bid, BidDecision, BidReview, BidVersion } from "./bid.model";
import { OrganizationResponsible } from "./organization-responsible.model";
import { Organization } from "./organization.model";
import { Tender, TenderVersion } from "./tender.model";
import { User } from "./user.model";

OrganizationResponsible.belongsTo(Organization, {
  foreignKey: "organization_id",
});
OrganizationResponsible.belongsTo(User, {
  foreignKey: "user_id",
});

export {
  Bid,
  BidDecision,
  BidReview,
  BidVersion,
  Organization,
  OrganizationResponsible,
  Tender,
  TenderVersion,
  User,
};
