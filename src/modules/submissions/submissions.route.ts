import { Router } from "express";
import {
  createSubmissionController,
  getSubmissionByIdController,
  getSubmissionsByChallengeController,
  getSubmissionsByUserController,
} from "./submissions.controller";

const submissionRouter = Router();

submissionRouter.post("/", createSubmissionController);
submissionRouter.get(
  "/challenge/:challengeId",
  getSubmissionsByChallengeController,
);
submissionRouter.get("/user/:userId", getSubmissionsByUserController);
submissionRouter.get("/:id", getSubmissionByIdController);

export default submissionRouter;
