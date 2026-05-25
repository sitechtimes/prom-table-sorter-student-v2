export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, fetch: refreshSession } = useUserSession();

  await refreshSession();

  if (!loggedIn.value) {
    return navigateTo("/admin/login");
  }
});
