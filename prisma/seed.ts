import { BadgeCode } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function main() {
  const badges = [
    {
      code: BadgeCode.FIRST_SUCCESS,
      name: "Premier succès",
      description: "Réussir son premier challenge",
      icon: "🎉",
    },
    {
      code: BadgeCode.PERFECT_SCORE,
      name: "Score parfait",
      description: "Obtenir 100% sur une soumission",
      icon: "💯",
    },
    {
      code: BadgeCode.REGULAR,
      name: "Régulier",
      description: "Effectuer 10 soumissions",
      icon: "🔥",
    },
    {
      code: BadgeCode.CONFIRMED,
      name: "Confirmé",
      description: "Réussir 5 challenges différents",
      icon: "🏆",
    },
    {
      code: BadgeCode.TOP_PLAYER,
      name: "Top player",
      description: "Entrer dans le top 3 du leaderboard",
      icon: "👑",
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: {
        code: badge.code,
      },
      update: {},
      create: badge,
    });
  }

  console.log("✅ Badges seeded");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });