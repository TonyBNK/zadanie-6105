import { body, check, param, query } from "express-validator";
import { BidStatus } from "../types";

const bidValidation = {
  createBid: [
    check("name", "Name should be 100 symbols max string")
      .notEmpty()
      .isString()
      .isLength({ max: 100 }),
    check("description", "Description should be 500 symbols max string")
      .notEmpty()
      .isString()
      .isLength({ max: 500 }),
    check(
      "status",
      "Status should be one of the following values: 'Created', 'Published', 'Closed'"
    ).isIn([BidStatus.Created, BidStatus.Published, BidStatus.Closed]),
    check("tenderId", "TenderId should be uuid with 100 symbols max")
      .isUUID()
      .isLength({ max: 100 }),
    check(
      "organizationId",
      "OrganizationId should be uuid with 100 symbols max"
    )
      .optional()
      .isUUID()
      .isLength({ max: 100 }),
    check("creatorUsername", "Creator username should be not empty string")
      .notEmpty()
      .isString(),
  ],

  getUserBids: [
    query("limit", "Limit should be positive number")
      .optional()
      .default(5)
      .isInt({ min: 0 })
      .toInt(),
    query("offset", "Offset should be positive number")
      .optional()
      .default(0)
      .isInt({ min: 0 })
      .toInt(),
    query("username", "Username should be string")
      .optional()
      .notEmpty()
      .isString(),
  ],

  getTenderBids: [
    param("tenderId", "TenderId should be uuid string").isUUID(),
    query("username", "Username should be provided").notEmpty().isString(),
    query("limit", "Limit should be positive number")
      .optional()
      .default(5)
      .isInt({ min: 0 })
      .toInt(),
    query("offset", "Offset should be positive number")
      .optional()
      .default(0)
      .isInt({ min: 0 })
      .toInt(),
  ],

  getBidStatus: [
    param("bidId", "BidId should be uuid string").isUUID(),
    query("username", "Username should be provided").notEmpty().isString(),
  ],

  updateBidStatus: [
    param("bidId", "BidId should be uuid string").isUUID(),
    query(
      "status",
      "Status should be one of the following values: 'Created', 'Published', 'Closed'"
    ).isIn([BidStatus.Created, BidStatus.Published, BidStatus.Closed]),
    query("username", "Username should be provided").notEmpty().isString(),
  ],

  updateBid: [
    param("bidId", "BidId should be uuid string").isUUID(),
    query("username", "Username should be provided").notEmpty().isString(),
    check("name", "Name should be 100 symbols max string")
      .optional()
      .notEmpty()
      .isString()
      .isLength({ max: 100 }),
    check("description", "Description should be 500 symbols max string")
      .optional()
      .notEmpty()
      .isString()
      .isLength({ max: 500 }),
    body()
      .custom((body) => {
        const keys = Object.keys(body);

        if (!Boolean(keys.length)) {
          return false;
        }

        return body;
      })
      .withMessage("Body required"),
    body()
      .custom((body) => {
        const allowedFields = {
          name: true,
          description: true,
        };

        for (const field in body) {
          if (!allowedFields[field as keyof typeof allowedFields]) {
            return false;
          }
        }

        return body;
      })
      .withMessage("Invalid body"),
  ],

  rollbackBid: [
    param("bidId", "BidId should be uuid string").isUUID(),
    param("version", "Version should be an integer more than 0")
      .isInt({ min: 1 })
      .toInt(),
    query("username", "Username should be provided").notEmpty().isString(),
  ],

  feedbackBid: [
    param("bidId", "BidId should be uuid string").isUUID(),
    query("bidFeedback", "Bid feedback should be provided")
      .notEmpty()
      .isString(),
    query("username", "Username should be provided").notEmpty().isString(),
  ],

  getReviews: [
    param("tenderId", "TenderId should be uuid string").isUUID(),
    query("authorUsername", "Author should be provided").notEmpty().isString(),
    query("requesterUsername", "Requester should be provided")
      .notEmpty()
      .isString(),
    query("limit", "Limit should be positive number")
      .optional()
      .default(5)
      .isInt({ min: 0 })
      .toInt(),
    query("offset", "Offset should be positive number")
      .optional()
      .default(0)
      .isInt({ min: 0 })
      .toInt(),
  ],

  submitDecision: [
    param("bidId", "BidId should be uuid string").isUUID(),
    query(
      "decision",
      "Decision should be one of the following values: 'Approved', 'Rejected'"
    ).isIn([BidStatus.Approved, BidStatus.Rejected]),
    query("username", "Username should be provided").notEmpty().isString(),
  ],
};

export default bidValidation;
