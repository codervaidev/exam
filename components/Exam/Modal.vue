<template>
    <AppModal size="sm:min-w-3xl" :isOpen="isOpen" title="Exam Management"
        description="Create and update exams for your institution" @onClose="onClose" v-if="isOpen">
        <AppLoader v-if="isLoading" />
        <form @submit="onSubmit" class="space-y-6">


            <FormField v-slot="{ componentField }" name="title">
                <FormItem>
                    <FormLabel>Exam Title</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="Topic, Chapter, Title..." v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="subject">
                <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="Subject Name" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <div class="grid grid-cols-2 gap-4">

                <FormField v-slot="{ componentField }" name="startTime">
                    <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                            <Input type="datetime-local" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="endTime">
                    <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                            <Input type="datetime-local" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>
            <div class="grid grid-cols-2 gap-4">


                <FormField v-slot="{ componentField }" name="duration">
                    <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Duration (minutes)" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="totalMarks">
                    <FormItem>
                        <FormLabel>Total Marks</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Total Marks" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

            </div>
            <div class="grid grid-cols-2 gap-4">

                <FormField v-slot="{ componentField }" name="resultPublishTime">
                    <FormItem>
                        <FormLabel>Result publish at</FormLabel>
                        <FormControl>
                            <Input type="datetime-local" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="solutionPublishTime">
                    <FormItem>
                        <FormLabel>Solution Publish at</FormLabel>
                        <FormControl>
                            <Input type="datetime-local" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>


            <div class="flex justify-end">

                <Button type="submit" class="ml-auto">
                    Save Exam
                </Button>
            </div>

        </form>

    </AppModal>
</template>

<script setup>

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { ExamSchema } from '~/schema/exam.schema';
const { isOpen, onClose, initialExam } = useExam()

const isLoading = ref(false)
const { toast } = useToast()

const form = useForm({
    schema: toTypedSchema(ExamSchema),
    defaultValues: {
        title: '',
        subject: '',
        startTime: '',
        endTime: '',
        duration: '',
        totalMarks: '',
        resultPublishTime: '',
        solutionPublishTime: ''
    }
})


const onSubmit = form.handleSubmit(async (data) => {

    try {
        isLoading.value = true
        if (initialExam.value.id) {
            const { error } = await useFetch(`/api/admin/exam/${initialExam.value.id}`, {
                method: 'PUT',
                body: {
                    ...data,
                    startTime: dateFieldFormat(data.startTime),
                    endTime: dateFieldFormat(data.endTime),
                    resultPublishTime: dateFieldFormat(data.resultPublishTime),
                    solutionPublishTime: dateFieldFormat(data.solutionPublishTime)
                }
            })
            if (error.value) {
                return toast({
                    title: error.value.statusCode.toString(),
                    description: error.value.statusMessage,
                    variant: 'destructive'
                })
            }

            refreshNuxtData('admin-exams')
            return onClose()
        }
        const { error } = await useAsyncData(() => $fetch('/api/admin/exam', {
            method: 'POST',
            body: data
        }))
        if (error.value) {
            return toast({
                title: error.value.statusCode.toString(),
                description: error.value.statusMessage,
                variant: 'destructive'
            })
        }

        refreshNuxtData('admin-exams')
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


watch(() => initialExam.value, (value) => {

    if (value) {
        form.setValues({
            title: value.title,
            subject: value.subject,
            startTime: dateFieldFormat(value.startTime),
            endTime: dateFieldFormat(value.endTime),
            duration: value.duration,
            totalMarks: value.totalMarks,
            resultPublishTime: dateFieldFormat(value.resultPublishTime),
            solutionPublishTime: dateFieldFormat(value.solutionPublishTime)
        })
    }
}, { immediate: true })




</script>

<style lang="scss" scoped></style>