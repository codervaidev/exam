<template>
    <AppModal :isOpen="isOpen" title="Lesson" description="Add or update lesson" @onClose="onClose" v-if="isOpen">
        <AppLoader v-if="isLoading" />

        <div class="space-y-6">
            <form @submit="onSubmit">
                <div class="space-y-6">

                    <FormField v-slot="{ componentField }" name="title">
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Lesson topic/title" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>


                    <div class="grid grid-cols-2 gap-6">
                        <!-- select -->
                        <FormField v-slot="{ componentField }" name="subjectId">
                            <FormItem>
                                <FormLabel>Subject</FormLabel>

                                <Select v-bind="componentField">
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select subject" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup v-for="s in subjects" :key="s.id">
                                            <SelectItem :value="s.id">
                                                {{ s.name }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="chapterId">
                            <FormItem>
                                <FormLabel>Chapter</FormLabel>

                                <Select v-bind="componentField">
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select chapter" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup v-for="c in chapters" :key="c.id">
                                            <SelectItem :value="c.id">
                                                {{ c.name }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>

                    <FormField v-slot="{ componentField }" name="source">
                        <FormItem>
                            <FormLabel>Source</FormLabel>

                            <Select v-bind="componentField">
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select source" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="youtube">
                                            Youtube
                                        </SelectItem>
                                        <SelectItem value="vimeo">
                                            Vimeo
                                        </SelectItem>
                                        <SelectItem value="vidstream">
                                            Streaming
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="content">
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Input placeholder="Course's content" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>



                </div>
                <div class="flex flex-col gap-2 py-6">
                    <div class="flex flex-row items-center w-full gap-4">
                        <Button type="submit" class="w-full">
                            {{ initialValues?.id ? 'Update' : 'Create' }} a lesson
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
import { LessonSchema } from '~/schema/lesson.schema';

const { subjects } = defineProps({
    subjects: Array
})

const chapters = ref([])

const { isOpen, onClose, onOpen, initialValues } = useLesson()

const formSchema = toTypedSchema(LessonSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        title: "",
        subjectId: "",
        chapterId: "",
        source: "",
        content: "",
    }
})

const isLoading = ref(false)
const { toast } = useToast()
const onSubmit = form.handleSubmit(async () => {

    try {
        isLoading.value = true


        if (initialValues?.value.id) {
            await $fetch(`/api/lessons/${initialValues.value.id}`, {
                method: 'put',
                body: form.values
            })
        } else {
            await $fetch('/api/lessons', {
                method: 'post',
                body: form.values
            })
        }

        refreshNuxtData('lessons')
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


watch(form.values, (value) => {
    if (value.subjectId) {
        chapters.value = subjects.find(s => s.id === value.subjectId).chapters
    }
}, {
    deep: true
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