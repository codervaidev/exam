// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@nuxt/icon",
    "nuxt-clarity-analytics"
  ],
  vite: {
    optimizeDeps: {
      exclude: ["vee-validate"],
    },
  },
  imports: {
    dirs: ["./lib"],
  },
  ssr: false,
  app: {
    head: {
      title: "ACS - Second timer",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
});