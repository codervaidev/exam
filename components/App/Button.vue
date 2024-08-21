<script setup lang="ts">
import { Button as BaseButton } from '@/components/ui/button';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
    loadingText: {
        type: String,
        default: 'Please wait',
    },
    label: {
        type: String,
        required: true,
    },
});

const buttonLabel = computed(() => (props.loading ? props.loadingText : props.label));
</script>

<template>
    <BaseButton v-bind="$attrs" :disabled="loading">
        <Icon name="lucide:loader-2" v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
        {{ buttonLabel }}
    </BaseButton>
</template>
