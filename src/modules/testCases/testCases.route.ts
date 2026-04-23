import { Router } from "express";
import {
  createTestCaseController,
  deleteTestCaseController,
  getAllTestCasesController,
  getTestCaseByIdController,
  getTestCasesByChallengeController,
  updateTestCaseController,
} from "./testCases.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const testCaseRouter = Router();

testCaseRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createTestCaseController,
);
testCaseRouter.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllTestCasesController,
);
testCaseRouter.get(
  "/challenge/:challengeId",
  authMiddleware,
  adminMiddleware,
  getTestCasesByChallengeController,
);
testCaseRouter.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getTestCaseByIdController,
);
testCaseRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateTestCaseController,
);
testCaseRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteTestCaseController,
);

export default testCaseRouter;
