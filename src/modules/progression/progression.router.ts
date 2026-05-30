import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getMyChallengeProgressController,
  getMyProgressionController,
} from "./progression.controller";

const progressionRouter = Router();

progressionRouter.get("/me", authMiddleware, getMyProgressionController);
progressionRouter.get(
  "/me/challenges/:challengeId",
  authMiddleware,
  getMyChallengeProgressController,
);

export default progressionRouter;
