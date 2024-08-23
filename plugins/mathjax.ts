import VueMathjax from "vue-mathjax-next";

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueMathjax);

  useHead({
    script: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML",
        async: true,
      },
    ],
  });
});
