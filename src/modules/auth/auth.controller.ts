import { Request, Response } from "express";
import { getMeService, loginService, registerService } from "./auth.service";
import { AuthenticatedRequest } from "../../middlewares/auth.middleware";

export async function registerController(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    const result = await registerService({
      username,
      email,
      password,
    });

    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "username, email et password sont requis" ||
        error.message ===
          "Le mot de passe doit contenir au moins 6 caractères" ||
        error.message === "Cet email est déjà utilisé" ||
        error.message === "Ce nom d'utilisateur est déjà utilisé" ||
        error.message === "JWT_SECRET manquant"
      ) {
        return res.status(400).json({ message: error.message });
      }

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

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "email et password sont requis" ||
        error.message === "Identifiants invalides" ||
        error.message === "JWT_SECRET manquant"
      ) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la connexion",
    });
  }
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
