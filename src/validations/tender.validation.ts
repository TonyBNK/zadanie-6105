import { body, check, param, query } from "express-validator";
import { TenderServiceType, TenderStatus } from "../types";

const tenderValidation = {
  createTender: [
    check("name", "Name should be 100 symbols max string")
      .notEmpty()
      .isString()
      .isLength({ max: 100 }),
    check("description", "Description should be 500 symbols max string")
      .notEmpty()
      .isString()
      .isLength({ max: 500 }),
    check(
      "serviceType",
      "Service type should be one of the following values: 'Construction', 'Delivery', 'Manufacture'"
    ).isIn([
      TenderServiceType.Construction,
      TenderServiceType.Delivery,
      TenderServiceType.Manufacture,
    ]),
    check(
      "status",
      "Status should be one of the following values: 'Created', 'Published', 'Closed'"
    ).isIn([TenderStatus.Created, TenderStatus.Published, TenderStatus.Closed]),
    check(
      "organizationId",
      "OrganizationId should be uuid with 100 symbols max"
    )
      .isUUID()
      .isLength({ max: 100 }),
    check("creatorUsername", "Creator username should be not empty string")
      .notEmpty()
      .isString(),
  ],

  getAllTenders: [
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
    query(
      "service_type",
      "Service type should be one of the following values: 'Construction', 'Delivery', 'Manufacture'"
    )
      .optional()
      .isIn([
        TenderServiceType.Construction,
        TenderServiceType.Delivery,
        TenderServiceType.Manufacture,
      ]),
  ],

  getUserTenders: [
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

  getTenderStatus: [
    param("tenderId", "TenderId should be uuid string").isUUID(),
    query("username", "Username should be string")
      .optional()
      .notEmpty()
      .isString(),
  ],

  updateTenderStatus: [
    param("tenderId", "TenderId should be uuid string").isUUID(),
    query(
      "status",
      "Status should be one of the following values: 'Created', 'Published', 'Closed'"
    ).isIn([TenderStatus.Created, TenderStatus.Published, TenderStatus.Closed]),
    query("username", "Username should be provided").notEmpty().isString(),
  ],

  updateTender: [
    param("tenderId", "TenderId should be uuid string").isUUID(),
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
    check(
      "serviceType",
      "Service type should be one of the following values: 'Construction', 'Delivery', 'Manufacture'"
    )
      .optional()
      .isIn([
        TenderServiceType.Construction,
        TenderServiceType.Delivery,
        TenderServiceType.Manufacture,
      ]),
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
          serviceType: true,
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

  rollbackTender: [
    param("tenderId", "TenderId should be uuid string").isUUID(),
    param("version", "Version should be an integer more than 0")
      .isInt({ min: 1 })
      .toInt(),
    query("username", "Username should be provided").notEmpty().isString(),
  ],
};

export default tenderValidation;
