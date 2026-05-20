import { Router } from "express";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  deleteUserController,
  getAllUsersController,
  updateUserRoleController,
} from "./users.controller";

const usersRouter = Router();

usersRouter.get("/", authMiddleware, adminMiddleware, getAllUsersController);

usersRouter.patch(
  "/:id/role",
  authMiddleware,
  adminMiddleware,
  updateUserRoleController,
);

usersRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteUserController,
);

export default usersRouter;
