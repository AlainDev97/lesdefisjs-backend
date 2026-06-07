import { Router } from "express";
import {
  createSubmissionController,
  getMySubmissionsController,
  getSubmissionByIdController,
  getSubmissionsByChallengeController,
  getSubmissionsByUserController,
} from "./submissions.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { submissionRateLimit } from "../../middlewares/submissionRateLimit.middleware";

const submissionRouter = Router();

submissionRouter.post(
  "/",
  authMiddleware,
  submissionRateLimit,
  createSubmissionController,
);

submissionRouter.get("/me", authMiddleware, getMySubmissionsController);

submissionRouter.get(
  "/challenge/:challengeId",
  authMiddleware,
  getSubmissionsByChallengeController,
);

submissionRouter.get(
  "/user/:userId",
  authMiddleware,
  getSubmissionsByUserController,
);

submissionRouter.get("/:id", authMiddleware, getSubmissionByIdController);

export default submissionRouter;
