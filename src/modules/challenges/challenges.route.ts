import { Router } from "express";
import {
  createChallengeController,
  deleteChallengeController,
  getAllChallengesController,
  getChallengeByIdController,
  updateChallengeController,
} from "./challenges.controller";

const router = Router();

router.get("/", getAllChallengesController);
router.get("/:id", getChallengeByIdController);
router.post("/", createChallengeController);
router.patch("/:id", updateChallengeController);
router.delete("/:id", deleteChallengeController);

export default router;
