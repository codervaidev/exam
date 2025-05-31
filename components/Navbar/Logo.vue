<template>
    <div @click="navigateToHome">
        <img src="/logo.png" alt="Rhombus Parallel" class="h-10 cursor-pointer" />
    </div>

</template>

<script setup>


const baseURL = 'https://rhombusparallel.com'

const navigateToHome = () => {
    window.location.href = baseURL
}



</script>

<style lang="scss" scoped></style>