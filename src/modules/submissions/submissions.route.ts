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
  getSubmissionsByChallengeController,
);
submissionRouter.get("/user/:userId", getSubmissionsByUserController);
submissionRouter.get("/:id", getSubmissionByIdController);

export default submissionRouter;
