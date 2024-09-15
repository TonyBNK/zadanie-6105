import { Router } from "express";
import organizationController from "../controllers/organization.controller";

const router = Router();

router.post("/new", organizationController.createOrganization);

router.get("/", organizationController.getAllOrganizations);

router.delete("/:id", organizationController.deleteOrganization);

export default router;
