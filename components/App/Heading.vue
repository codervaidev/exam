<template>
    <div :class="[center?'text-center':'text-left']">
        <h1 class="text-2xl font-bold">{{ title }}</h1>
        <p class="mt-2 font-light text-neutral-500">{{ subtitle }}</p>
    </div>
</template>

<script setup lang="ts">
interface HeadingProps {
    title: string;
    subtitle?: string;
    center?: boolean;
}

const props = defineProps<HeadingProps>();

</script>

<style lang="scss" scoped></style>