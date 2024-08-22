import { faker } from "@faker-js/faker";
export default defineEventHandler(async () => {
  const numberOfUsers = 100; // Number of users to create

  for (let i = 0; i < numberOfUsers; i++) {
    await db.user.create({
      data: {
        name: faker.name.fullName(),
        phone: faker.phone.number(),
        district: faker.address.state(),
        thana: faker.address.city(),
        institute: faker.company.name(),
        batch:
          "HSC " + faker.date.past(10, new Date()).getFullYear().toString(),
      },
    });
  }

  const totalCount = await db.user.count();

  return {
    message: "Users created successfully",
    totalCount,
  };
});
