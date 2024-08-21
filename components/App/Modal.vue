<template>
    <Dialog :open="isModalVisible" @update:open="$emit('onClose')">

        <DialogContent class="max-h-screen overflow-y-scroll hide-scrollbar" :class="size ? size : 'sm:max-w-[425px]'">
            <DialogHeader>
                <DialogTitle v-if="title" class="text-xl">{{ title }}</DialogTitle>
                <DialogDescription v-if="description">
                    {{ description }}
                </DialogDescription>
            </DialogHeader>

            <slot></slot>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">

interface ModalProps {
    isOpen?: boolean;
    title?: string;
    description?: string;
    size?: string;
}

const props = defineProps<ModalProps>();
const emit = defineEmits(['onClose']);

const isModalVisible = computed({
    get: () => props.isOpen,
    set: (value: boolean) => emit('onClose')
});


</script>

<style lang="scss" scoped></style>