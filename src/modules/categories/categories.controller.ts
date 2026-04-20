import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "./categories.service";

type Params = {
  id: string;
};

export const createCategoryController = asyncHandler(
  async (req: Request<Params>, res: Response) => {
    const category = await createCategory(req.body);

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  },
);

export const getAllCategoriesController = asyncHandler(
  async (_req: Request<Params>, res: Response) => {
    const categories = await getAllCategories();

    res.status(200).json({
      data: categories,
    });
  },
);

export const getCategoryByIdController = asyncHandler(
  async (req: Request<Params>, res: Response) => {
    const category = await getCategoryById(req.params.id);

    res.status(200).json({
      data: category,
    });
  },
);

export const updateCategoryController = asyncHandler(
  async (req: Request<Params>, res: Response) => {
    const category = await updateCategory(req.params.id, req.body);

    res.status(200).json({
      message: "Category updated successfully",
      data: category,
    });
  },
);

export const deleteCategoryController = asyncHandler(
  async (req: Request<Params>, res: Response) => {
    const result = await deleteCategory(req.params.id);

    res.status(200).json(result);
  },
);
