import { prisma } from "../../lib/prisma";
import { slugify } from "../../utils/slugify";
import { ApiError } from "../../utils/ApiError";

export async function createCategory(data: {
  name: string;
  description?: string;
}) {
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
