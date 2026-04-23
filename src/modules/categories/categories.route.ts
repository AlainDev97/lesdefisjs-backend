import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "./categories.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const categoryRouter = Router();

// Public
categoryRouter.get("/", getAllCategoriesController);
categoryRouter.get("/:id", getCategoryByIdController);

// Admin only
categoryRouter.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCategoryController,
);
categoryRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCategoryController,
);
categoryRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategoryController,
);

export default categoryRouter;
