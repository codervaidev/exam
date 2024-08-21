export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();
  if (user.value && user.value.role === "USER") {
    return navigateTo("/");
  }
});
