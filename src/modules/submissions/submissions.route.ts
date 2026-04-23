import { Router } from "express";
import {
  createSubmissionController,
  getSubmissionByIdController,
  getSubmissionsByChallengeController,
  getSubmissionsByUserController,
} from "./submissions.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const submissionRouter = Router();

submissionRouter.post("/", authMiddleware, createSubmissionController);
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
