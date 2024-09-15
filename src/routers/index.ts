import { Router } from "express";
import bidRouter from "./bid.router";
import organizationResponsibleRouter from "./organization-responsible.router";
import organizationRouter from "./organization.router";
import pingRouter from "./ping.router";
import tenderRouter from "./tender.router";
import userRouter from "./user.router";

const router = Router();

router.use("/ping", pingRouter);
router.use("/tenders", tenderRouter);
router.use("/bids", bidRouter);

// for testing purposes
router.use("/users", userRouter);
router.use("/organizations", organizationRouter);
router.use("/organization_responsibles", organizationResponsibleRouter);

export default router;
