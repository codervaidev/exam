export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;

  const { address, tshirt } = await readBody(event);

  const user = await db.user.update({
    where: { id: userId },
    data: {
      address,
      tshirt,
    },
  });

  return user;
});
