// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const sessionPassword =
  (globalThis as any)["process"]?.env?.NUXT_SESSION_PASSWORD ?? "";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    session: {
      password: sessionPassword,
      cookie: {
        sameSite: "lax",
      },
    },
    // DATABASE_URI: process.env.DATABASE_URI
  },
  vite: {
    plugins: [tailwindcss() as any],
  },

  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },

  modules: ["nuxt-auth-utils", "@nuxtjs/color-mode"],
});
