import { prisma } from "../../lib/prisma";
import { UserRole } from "@prisma/client";

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

type UpdateUserRoleServiceParams = {
  targetUserId: string;
  currentUserId: string;
  role: UserRole;
};

export async function updateUserRoleService({
  targetUserId,
  currentUserId,
  role,
}: UpdateUserRoleServiceParams) {
  if (targetUserId === currentUserId && role !== UserRole.ADMIN) {
    throw new Error("Vous ne pouvez pas retirer votre propre rôle ADMIN");
  }

  return prisma.user.update({
    where: { id: targetUserId },
    data: { role },
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
  });
}

type DeleteUserServiceParams = {
  targetUserId: string;
  currentUserId: string;
};

export async function deleteUserService({
  targetUserId,
  currentUserId,
}: DeleteUserServiceParams) {
  if (targetUserId === currentUserId) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte");
  }

  return prisma.user.delete({
    where: { id: targetUserId },
  });
}
