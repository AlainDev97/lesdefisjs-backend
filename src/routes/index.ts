import { Router } from "express";
import categoriesRoutes from "../modules/categories/categories.route";
import challengesRoutes from "../modules/challenges/challenges.route";

const router = Router();

router.use("/categories", categoriesRoutes);
router.use("/challenges", challengesRoutes);

export default router;
