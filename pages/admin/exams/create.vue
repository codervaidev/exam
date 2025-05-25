<template>

    <div>


        <div class="flex justify-between mb-2">
            <h1 class="text-2xl font-bold">
                Schedule An Exam
            </h1>
        </div>

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

            <div class="grid grid-cols-2 gap-4">

                <FormField v-slot="{ field }" name="negativeMarking">
                    <FormItem
                        class="flex flex-row items-start p-4 space-x-3 space-y-0 bg-white border rounded-md dark:bg-slate-800">
                        <FormControl>
                            <Checkbox :checked="form.values.negativeMarking"
                                @click="form.setFieldValue('negativeMarking', !form.values.negativeMarking)" />
                        </FormControl>
                        <div class="space-y-1 leading-none">
                            <FormLabel>
                                Negative Marking
                            </FormLabel>
                            <FormDescription>
                                Apply negative marking for incorrect answers
                            </FormDescription>
                        </div>
                    </FormItem>
                </FormField>
                <FormField v-slot="{ field }" name="shuffleQuestions">
                    <FormItem
                        class="flex flex-row items-start p-4 space-x-3 space-y-0 bg-white border rounded-md dark:bg-slate-800">
                        <FormControl>
                            <Checkbox :checked="form.values.shuffleQuestions"
                                @click="form.setFieldValue('shuffleQuestions', !form.values.shuffleQuestions)" />
                        </FormControl>
                        <div class="space-y-1 leading-none">
                            <FormLabel>
                                Shuffle Question
                            </FormLabel>
                            <FormDescription>
                                Shuffle question order for each student
                            </FormDescription>
                        </div>
                    </FormItem>
                </FormField>
            </div>

            <div class="grid grid-cols-3 gap-4">

                <FormField v-slot="{ componentField }" name="data.hard">
                    <FormItem>
                        <FormLabel>Hard</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Hard" v-bind="componentField" />
                        </FormControl>
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="data.medium">
                    <FormItem>
                        <FormLabel>Medium</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Medium" v-bind="componentField" />
                        </FormControl>
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="data.easy">
                    <FormItem>
                        <FormLabel>Easy</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="Easy" v-bind="componentField" />
                        </FormControl>
                    </FormItem>
                </FormField>

            </div>


            <div class="flex justify-end">

                <Button type="submit" class="ml-auto">
                    Save Exam
                </Button>
            </div>

        </form>
    </div>


</template>

<script setup>

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { ExamSchema } from '~/schema/exam.schema';


definePageMeta({
    layout: 'admin',
})

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
        solutionPublishTime: '',
        shuffleQuestions: false,
        negativeMarking: false,
        data: {
            hard: 0,
            medium: 0,
            easy: 0
        }
    }
})


const onSubmit = form.handleSubmit(async (data) => {

    try {


        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);
        const durationMs = data.duration * 60 * 1000; // Convert minutes to milliseconds
        const resultPublishTime = new Date(data.resultPublishTime);
        const solutionPublishTime = new Date(data.solutionPublishTime);
        const minPublishTime = new Date(endTime.getTime() + durationMs);

        if (resultPublishTime <= minPublishTime || solutionPublishTime <= minPublishTime) {
            return toast({
                title: "Invalid Publish Times",
                description: "Result and solution publish times must be after exam end time plus duration",
                variant: "destructive"
            });
        }


        if (startTime >= endTime) {
            return toast({
                title: "Invalid Start Time",
                description: "Start time must be before end time",
                variant: "destructive"
            });
        }

        isLoading.value = true

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

        navigateTo('/admin/exams')

    } catch (error) {
        return toast({
            title: error.toString(),
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})



</script>

<style lang="scss" scoped></style>