<template>
    <div v-katex="model">

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