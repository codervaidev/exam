<template>

    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <Card class="p-2 border rounded-sm">

                    <Label v-if="label">
                        {{ label }}
                    </Label>
                    <div class="flex items-center">
                        <div>
                            <code class="">
                                {{ text.length > 21 ? text.slice(0, 21) + '...' : text }}
                            </code>
                        </div>
                        <Button variant="secondary" @click="copyText">
                            <Icon name="tabler:copy" />
                        </Button>
                    </div>
                </Card>
            </TooltipTrigger>
            <TooltipContent>
                <p>{{ text }}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>


</template>

<script setup lang="ts">

import { useToast } from '@/components/ui/toast/use-toast'
interface CopyProps {
    text: string,
    label?: string
}

const props = defineProps<CopyProps>()

const { toast } = useToast()

const copyText = () => {
    navigator.clipboard.writeText(props.text)

    toast({
        title: 'Copied to clipboard',
    })
}



</script>

<style lang="scss" scoped></style>