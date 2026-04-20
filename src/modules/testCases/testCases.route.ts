import { Router } from "express";
import {
  createTestCaseController,
  deleteTestCaseController,
  getAllTestCasesController,
  getTestCaseByIdController,
  getTestCasesByChallengeController,
  updateTestCaseController,
} from "./testCases.controller";

const router = Router();

router.get("/", getAllTestCasesController);
router.get("/challenge/:challengeId", getTestCasesByChallengeController);
router.get("/:id", getTestCaseByIdController);
router.post("/", createTestCaseController);
router.patch("/:id", updateTestCaseController);
router.put("/:id", updateTestCaseController);
router.delete("/:id", deleteTestCaseController);

export default router;
