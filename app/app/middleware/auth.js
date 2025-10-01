export default defineNuxtRouteMiddleware((to, from) => {
  //example from nuxt.js docs we dont need to keep
  // isAuthenticated() is an example method verifying if a user is authenticated
  if (isAuthenticated() === false) {
    return navigateTo("/login");
  }
});
