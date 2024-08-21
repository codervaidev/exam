<template>
    <AppModal :isOpen="isOpen" title="Subject" description="Add or update subject" @onClose="onClose" v-if="isOpen">
        <AppLoader v-if="isLoading" />

        <div class="space-y-6">
            <form @submit="onSubmit">
                <div class="space-y-6">

                    <FormField v-slot="{ componentField }" name="name">
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Subject Name" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                </div>
                <div class="flex flex-col gap-2 py-6">
                    <div class="flex flex-row items-center w-full gap-4">
                        <Button type="submit" class="w-full">
                            {{ initialValues?.id ? 'Update' : 'Create' }} Subject
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
import { SubjectSchema } from '~/schema/subject.schema';

const { isOpen, onClose, onOpen, initialValues } = useSubject()

const formSchema = toTypedSchema(SubjectSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: "",
    }
})

const isLoading = ref(false)
const { toast } = useToast()




const onSubmit = form.handleSubmit(async () => {

    try {
        isLoading.value = true


        if (initialValues?.value.id) {
            await $fetch(`/api/subjects/${initialValues.value.id}`, {
                method: 'put',
                body: form.values
            })
        } else {
            await $fetch('/api/subjects', {
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




// watch(() => initialValues, (value) => {
//     form.setValues({
//         title: value.title,
//         description: value.description,
//         image: value.image
//     })
//     imageUrl.value = value.image
// }, {
//     immediate: true
// })


</script>
<style lang="scss" scoped></style>