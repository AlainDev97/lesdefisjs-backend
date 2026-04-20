import { Router } from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "./categories.controller";

const router = Router();

router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);
router.post("/", createCategoryController);
router.patch("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

export default router;
