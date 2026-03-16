import { PrismaClient, ScoringMode } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const year = await prisma.awardsYear.upsert({
    where: { year: 2025 },
    update: {},
    create: {
      year: 2025,
      title: "97th Academy Awards",
      ballotLockAt: new Date("2025-03-02T20:00:00.000Z"),
      scoringMode: ScoringMode.WEIGHTED
    }
  });

  const categories = [
    ["best-picture", "Best Picture", 10, true, ["Anora", "The Brutalist", "Conclave"]],
    ["best-director", "Best Director", 8, true, ["Sean Baker", "Brady Corbet", "Coralie Fargeat"]],
    ["best-actress", "Best Actress", 7, true, ["Mikey Madison", "Demi Moore", "Fernanda Torres"]],
    ["best-actor", "Best Actor", 7, true, ["Adrien Brody", "Timothée Chalamet", "Colman Domingo"]],
    ["best-animated-feature", "Best Animated Feature", 4, false, ["Flow", "Inside Out 2", "The Wild Robot"]]
  ] as const;

  for (const [slug, name, points, isMajor, nominees] of categories) {
    const cat = await prisma.category.upsert({
      where: { awardsYearId_slug: { awardsYearId: year.id, slug } },
      update: { name, points, isMajor },
      create: {
        awardsYearId: year.id,
        slug,
        name,
        points,
        isMajor,
        displayOrder: categories.findIndex((c) => c[0] === slug)
      }
    });

    for (const nominee of nominees) {
      await prisma.nominee.upsert({
        where: { id: `${cat.id}:${nominee}` },
        update: {},
        create: { id: `${cat.id}:${nominee}`, categoryId: cat.id, name: nominee }
      });
    }
  }

  await prisma.triviaQuestion.createMany({
    data: [
      {
        question: "Which film won the first Best Picture Oscar?",
        options: ["Wings", "Sunrise", "Metropolis"],
        correctIndex: 0,
        category: "Records"
      },
      {
        question: "Who has the most acting Oscar wins?",
        options: ["Meryl Streep", "Katharine Hepburn", "Jack Nicholson"],
        correctIndex: 1,
        category: "Historic Wins"
      }
    ],
    skipDuplicates: true
  });

  console.log("Seeded 2025 awards data.");
}

main().finally(async () => prisma.$disconnect());
