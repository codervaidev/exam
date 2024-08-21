export default defineNuxtRouteMiddleware(async (from, to) => {
  const user = useUser();
  if (user.value) {
    return navigateTo("/");
  }
});
