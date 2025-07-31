<template>
    <div class="">
        <vue-mathjax :options="options" :formula="model" :safe="false" />
    </div>
</template>

<script setup>

const model = defineModel()

const options = {
    tex: {
        inlineMath: [['$', '$']],
    },
}

</script>

<style lang="scss" scoped></style>