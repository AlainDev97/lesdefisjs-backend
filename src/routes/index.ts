import { Router } from "express";
import categoriesRoutes from "../modules/categories/categories.route";
import challengesRoutes from "../modules/challenges/challenges.route";
import testCasesRoutes from "../modules/testCases/testCases.route";

const router = Router();

router.use("/categories", categoriesRoutes);
router.use("/challenges", challengesRoutes);
router.use("/testcases", testCasesRoutes);

export default router;
