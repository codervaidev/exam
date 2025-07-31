<template>
    <div class="">
        <vue-mathjax :options="mathjaxOptions" :formula="model" :safe="false" />
    </div>
</template>

<script setup>

const model = defineModel()

const mathjaxOptions = {
    tex: {
        inlineMath: [['$', '$'],], // Define inline math delimiters
        displayMath: [['$$', '$$']], // Define display math delimiters
        macros: {
            RR: '\\mathbb{R}',
            bold: ['\\mathbf{#1}', 1],
        },
    },
}


</script>

<style lang="scss" scoped></style>