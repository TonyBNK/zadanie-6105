import { Router } from "express";
import bidController from "../controllers/bid.controller.js";
import bidValidation from "../validations/bid.validation.js";

const router = Router();

router.post("/new", bidValidation.createBid, bidController.createBid);

router.get("/my", bidValidation.getUserBids, bidController.getUserBids);

router.get(
  "/:tenderId/list",
  bidValidation.getTenderBids,
  bidController.getTenderBids
);

router.get(
  "/:bidId/status",
  bidValidation.getBidStatus,
  bidController.getBidStatus
);

router.put(
  "/:bidId/status",
  bidValidation.updateBidStatus,
  bidController.updateBidStatus
);

router.patch("/:bidId/edit", bidValidation.updateBid, bidController.updateBid);

router.put(
  "/:bidId/rollback/:version",
  bidValidation.rollbackBid,
  bidController.rollbackBid
);

router.put(
  "/:bidId/feedback",
  bidValidation.feedbackBid,
  bidController.feedbackBid
);

router.get(
  "/:tenderId/reviews",
  bidValidation.getReviews,
  bidController.getReviews
);

router.put(
  "/:bidId/submit_decision",
  bidValidation.submitDecision,
  bidController.submitDecision
);

export default router;
