import { Response } from "express";
import { UserRole } from "../../generated/prisma/client";
import type { AuthenticatedRequest } from "../../middlewares/auth.middleware";
import {
  deleteUserService,
  getAllUsersService,
  updateUserRoleService,
} from "./users.service";

export async function getAllUsersController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const users = await getAllUsersService();

    return res.status(200).json(users);
  } catch {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des utilisateurs",
    });
  }
}

export async function updateUserRoleController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Non authentifié",
      });
    }

    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        message: "Rôle invalide",
      });
    }

    const user = await updateUserRoleService({
      targetUserId: String(id),
      currentUserId: req.user.id,
      role,
    });

    return res.status(200).json({
      message: "Rôle utilisateur mis à jour",
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur serveur lors de la modification du rôle";

    return res.status(403).json({
      message,
    });
  }
}

export async function deleteUserController(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Non authentifié",
      });
    }

    const { id } = req.params;

    await deleteUserService({
      targetUserId: String(id),
      currentUserId: req.user.id,
    });

    return res.status(200).json({
      message: "Utilisateur supprimé",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur serveur lors de la suppression de l'utilisateur";

    return res.status(403).json({
      message,
    });
  }
}