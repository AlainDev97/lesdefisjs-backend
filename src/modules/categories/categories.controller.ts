import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
} from "./categories.service";

export const createCategoryController = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await createCategory(req.body);

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  },
);

export const getAllCategoriesController = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await getAllCategories();

    res.status(200).json({
      data: categories,
    });
  },
);

export const getCategoryByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await getCategoryById(req.params.id);

    res.status(200).json({
      data: category,
    });
  },
);
