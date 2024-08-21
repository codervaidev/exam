<template>
    <div class="h-[68vh] flex flex-col gap-2 justify-center items-center">
        <AppHeading center :title="title ? title : 'Cart is Empty'"
            :subtitle="subtitle ? subtitle : 'Add some books to cart.'" />
        <div class="w-48 mt-4">
            <Button outline @click="navigateTo('/')" v-if="showReset"> Back to home

            </Button>
        </div>
    </div>
</template>
<script setup lang="ts">
interface EmptyStateProps {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}
defineProps<EmptyStateProps>();
</script>
