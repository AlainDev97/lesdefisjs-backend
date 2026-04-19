import { Router } from "express";
import categoriesRoutes from "../modules/categories/categories.route";

const router = Router();

router.use("/categories", categoriesRoutes);

export default router;
