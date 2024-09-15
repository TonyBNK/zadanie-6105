import { Router } from "express";
import organizationResponsibleController from "../controllers/organization-responsible.controller";

const router = Router();

router.post(
  "/new",
  organizationResponsibleController.createOrganizationResponsible
);

router.get(
  "/",
  organizationResponsibleController.getAllOrganizationResponsibles
);

router.delete(
  "/:id",
  organizationResponsibleController.deleteOrganizationResponsible
);

export default router;
