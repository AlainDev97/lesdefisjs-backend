import { Router } from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
} from "./categories.controller";

const router = Router();

router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);
router.post("/", createCategoryController);

export default router;
