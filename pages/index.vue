<template>
  <div>
    <h1>MathJax Example</h1>
   
      <div v-katex="formula"></div>
   
  </div>
</template>

<script setup lang="ts">


const formula = ref<string>('$x^2$')



</script>

<style scoped></style>