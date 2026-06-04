import { Router } from "express";
import {
  createChallengeController,
  deleteChallengeController,
  getAdminChallengesController,
  getAllChallengesController,
  getAllChallengesWithProgressController,
  getChallengeByIdController,
  getChallengeBySlugController,
  updateChallengeController,
} from "./challenges.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const challengeRouter = Router();

// Public
challengeRouter.get(
  "/me",
  authMiddleware,
  getAllChallengesWithProgressController,
);
challengeRouter.get("/", getAllChallengesController);
challengeRouter.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  getAdminChallengesController,
);
challengeRouter.get("/slug/:slug", getChallengeBySlugController);
challengeRouter.get("/:id", getChallengeByIdController);

// Admin only
challengeRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createChallengeController,
);
challengeRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateChallengeController,
);
challengeRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteChallengeController,
);

export default challengeRouter;
