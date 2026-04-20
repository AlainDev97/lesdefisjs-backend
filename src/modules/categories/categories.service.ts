import { prisma } from "../../lib/prisma";
import { slugify } from "../../utils/slugify";
import { ApiError } from "../../utils/ApiError";

type CreateCategoryInput = {
  name: string;
  description?: string;
};

type UpdateCategoryInput = {
  name?: string;
  description?: string;
};

export async function createCategory(data: CreateCategoryInput) {
  const slug = slugify(data.name);

  const existingCategory = await prisma.category.findFirst({
    where: {
      OR: [{ name: data.name }, { slug }],
    },
  });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
    },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  let slug = existingCategory.slug;

  if (data.name) {
    slug = slugify(data.name);

    const duplicateCategory = await prisma.category.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [{ name: data.name }, { slug }],
          },
        ],
      },
    });

    if (duplicateCategory) {
      throw new ApiError(409, "Another category with this name already exists");
    }
  }

  return prisma.category.update({
    where: { id },
    data: {
      name: data.name ?? existingCategory.name,
      description:
        data.description !== undefined
          ? data.description
          : existingCategory.description,
      slug,
    },
  });
}

export async function deleteCategory(id: string) {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new ApiError(404, "Category not found");
  }

  await prisma.category.delete({
    where: { id },
  });

  return { message: "Category deleted successfully" };
}
