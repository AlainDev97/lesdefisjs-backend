import rateLimit from "express-rate-limit";

export const submissionRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    message: "Trop de soumissions. Réessaie dans quelques instants.",
  },
});
