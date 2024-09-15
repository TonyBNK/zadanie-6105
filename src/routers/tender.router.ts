import { Router } from "express";
import tenderController from "../controllers/tender.controller.js";
import tenderValidation from "../validations/tender.validation.js";

const router = Router();

router.post(
  "/new",
  tenderValidation.createTender,
  tenderController.createTender
);

router.get("/", tenderValidation.getAllTenders, tenderController.getAllTenders);

router.get(
  "/my",
  tenderValidation.getUserTenders,
  tenderController.getUserTenders
);

router.get(
  "/:tenderId/status",
  tenderValidation.getTenderStatus,
  tenderController.getTenderStatus
);

router.put(
  "/:tenderId/status",
  tenderValidation.updateTenderStatus,
  tenderController.updateTenderStatus
);

router.patch(
  "/:tenderId/edit",
  tenderValidation.updateTender,
  tenderController.updateTender
);

router.put(
  "/:tenderId/rollback/:version",
  tenderValidation.rollbackTender,
  tenderController.rollbackTender
);

export default router;
