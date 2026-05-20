import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import usersRouter from "../modules/users/users.router";
import categoriesRoutes from "../modules/categories/categories.route";
import challengesRoutes from "../modules/challenges/challenges.route";
import testCasesRoutes from "../modules/testCases/testCases.route";
import submissionRoutes from "../modules/submissions/submissions.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/categories", categoriesRoutes);
router.use("/challenges", challengesRoutes);
router.use("/submissions", submissionRoutes);
router.use("/testcases", testCasesRoutes);

export default router;
