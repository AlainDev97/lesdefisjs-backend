import { Router } from "express";
import categoriesRoutes from "../modules/categories/categories.route";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API OK",
  });
});

router.use("/categories", categoriesRoutes);

export default router;
