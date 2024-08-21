<template>
    <AppModal :isOpen="isOpen" title="Course" description="Course Details" @onClose="onClose" v-if="isOpen">
        <AppLoader v-if="isLoading" />

        <div class="space-y-6">
            <form @submit="onSubmit">
                <div class="space-y-6">
                    <div @click="uploadCourseImage"
                        class="relative flex flex-col items-center justify-center gap-4 p-20 transition border-2 cursor-pointer hover:opacity-70 border-nuetral-300 text-nuetral-600">

                        <Icon v-if="!imageUrl" name="lucide:image-plus" size="50" />
                        <div v-if="!imageUrl" class="text-lg font-semibold">Click to upload</div>
                        <div v-else class="absolute inset-0 w-full h-full">
                            <img :src="imageUrl" class="object-cover w-full h-full" alt="House">
                        </div>
                    </div>
                    <FormField v-slot="{ componentField }" name="title">
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Course's Name" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>


                    <FormField v-slot="{ componentField }" name="description">
                        <FormItem>
                            <FormLabel>Course Description</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Course Description" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>





                </div>
                <div class="flex flex-col gap-2 py-6">
                    <div class="flex flex-row items-center w-full gap-4">
                        <Button type="submit" class="w-full">
                            {{ initialValues?.id ? 'Update' : 'Create' }} a course
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
import { CourseSchema } from '~/schema/course.schema';

const { isOpen, onClose, onOpen, initialValues } = useCourse()

const formSchema = toTypedSchema(CourseSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        title: '',
        description: '',
        image: ''
    }
})

const isLoading = ref(false)
const { toast } = useToast()
const { openWidget } = useCloudinary()

const imageUrl = ref('')

const uploadCourseImage = () => {
    openWidget({
        multiple: false,
        crop: true
    }, {
        onClose, onOpen, onSuccess: (result) => {
            imageUrl.value = result.info.secure_url
        }
    })
}

const onSubmit = form.handleSubmit(async () => {

    try {
        isLoading.value = true


        if (initialValues?.value.id) {
            await $fetch(`/api/courses/${initialValues.value.id}`, {
                method: 'put',
                body: form.values
            })
        } else {
            await $fetch('/api/courses', {
                method: 'post',
                body: form.values
            })
        }

        refreshNuxtData('courses')
        return onClose()
    } catch (error) {

        return toast({
            title: error.toString(),
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})


watch(imageUrl, (value) => {
    form.setFieldValue('image', value)
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