import { faker } from "@faker-js/faker";

export default defineEventHandler(async () => {
  const numberOfUsers = 100; // Number of users to create

  for (let i = 0; i < numberOfUsers; i++) {
    await query(
      `INSERT INTO free_exam_users (name, phone, district, thana, institute, level) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        faker.name.fullName(),
        faker.phone.number(),
        faker.address.state(),
        faker.address.city(),
        faker.company.name(),
        "HSC " + faker.date.past(10, new Date()).getFullYear().toString()
      ]
    );
  }

  const totalCountResult = await query<{count: number}>(`SELECT COUNT(*) as count FROM free_exam_users`);
  const totalCount = totalCountResult.data?.[0]?.count || 0;

  return {
    message: "Users created successfully",
    totalCount,
  };
});
