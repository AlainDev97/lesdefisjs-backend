import { Request, Response } from "express";
import { getMeService, loginService, registerService } from "./auth.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

function setAuthCookie(res: Response, token: string) {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function registerController(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    const result = await registerService({
      username,
      email,
      password,
    });

    setAuthCookie(res, result.token);

    return res.status(201).json({
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de l'inscription",
    });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await loginService({
      email,
      password,
    });

    setAuthCookie(res, result.token);

    return res.status(200).json({
      user: result.user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la connexion",
    });
  }
}

export async function logoutController(req: Request, res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Déconnexion réussie",
  });
}

export async function meController(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Non authentifié",
      });
    }

    const user = await getMeService(req.user.id);

    return res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error && error.message === "Utilisateur introuvable") {
      return res.status(404).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la récupération du profil",
    });
  }
}
