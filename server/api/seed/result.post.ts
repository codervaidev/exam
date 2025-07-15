import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async () => {
  const numberOfResult = 100; // Number of users to create

  const userResult = await query<{id: string}>(`
    SELECT id FROM free_exam_users 
    ORDER BY created_at DESC 
    OFFSET $1
  `, [Math.floor(Math.random() * 10)]);

  const users = userResult.data || [];

  for (const u of users) {
    await query(
      `INSERT INTO free_exam_submissions (id, user_id, exam_id, marks, duration, submitted_at, status, answers, questions, attempt, correct, incorrect, skipped) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        uuidv4(),
        u.id,
        "66c6bdb969777e0cd86054b2", // You may need to update this exam ID
        Math.floor(Math.random() * 100),
        Math.floor(Math.random() * 60),
        faker.date.recent(1),
        "submitted",
        [],
        [],
        1,
        Math.floor(Math.random() * 50),
        Math.floor(Math.random() * 20),
        Math.floor(Math.random() * 10)
      ]
    );
  }

  return true;
});
