import { faker } from "@faker-js/faker";
export default defineEventHandler(async () => {
  const numberOfResult = 100; // Number of users to create

  const user = await db.user.findMany({
    orderBy: {
      id: "desc",
    },
    skip: Math.floor(Math.random() * 10), // Random skip to simulate randomness
  });

  user.forEach(async (u) => {
    await db.submission.create({
      data: {
        userId: u.id,
        examId: "66c6bdb969777e0cd86054b2",
        marks: Math.floor(Math.random() * 100),
        duration: Math.floor(Math.random() * 60),
        submittedAt: faker.date.recent(1),
      },
    });
  });

  return true;
});
