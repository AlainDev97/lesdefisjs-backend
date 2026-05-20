import { prisma } from "../../lib/prisma";
import { UserRole } from "../../generated/prisma/client";

export async function getAllUsersService() {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          submissions: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateUserRoleService(userId: string, role: UserRole) {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteUserService(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  });
}
