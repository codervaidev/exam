<template>
    <AppModal :isOpen="isOpen" title="Chapter" description="Add or update chapter" @onClose="onClose" v-if="isOpen">
        <AppLoader v-if="isLoading" />

        <div class="space-y-6">
            <form @submit="onSubmit">
                <div class="space-y-6">

                    <FormField v-slot="{ componentField }" name="name">
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Chapter Name" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                </div>
                <div class="flex flex-col gap-2 py-6">
                    <div class="flex flex-row items-center w-full gap-4">
                        <Button type="submit" class="w-full">
                            {{ initialValues?.id ? 'Update' : 'Create' }} Chapter
                        </Button>
                    </div>


                </div>
            </form>
        </div>

    </AppModal>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { ChapterSchema } from '~/schema/subject.schema';

const { isOpen, onClose, onOpen, initialValues } = useChapter()

const formSchema = toTypedSchema(ChapterSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        subjectId: "",
        name: "",
    }
})

const isLoading = ref(false)
const { toast } = useToast()




const onSubmit = form.handleSubmit(async () => {

    try {
        isLoading.value = true


        if (initialValues?.value.id) {
            await $fetch(`/api/subjects/chapter/${initialValues.value.id}`, {
                method: 'put',
                body: form.values
            })
        } else {
            await $fetch('/api/subjects/chapter', {
                method: 'post',
                body: form.values
            })
        }

        refreshNuxtData('subjects')
        return onClose()
    } catch (error) {
        console.log(error)
        return toast({
            title: error.toString(),
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})




watch(() => initialValues.value, (value) => {
    form.setFieldValue('subjectId', value?.subjectId)
}, {
    immediate: true
})


</script>
<style lang="scss" scoped></style>