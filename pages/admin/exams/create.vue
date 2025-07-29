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
                <FormField v-slot="{ componentField }" name="sequenceOrder">
                    <FormItem>
                        <FormLabel>Sequence Order</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="1, 2, 3..." v-bind="componentField" />
                        </FormControl>
                        <FormDescription>
                            Order in which this exam should be taken (1 = first, 2 = second, etc.)
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="yt_class_link">
                    <FormItem>
                        <FormLabel>Class Link</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                v-bind="componentField" />
                        </FormControl>
                        <FormDescription>
                            Youtube class link
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>

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

// Fetch campaigns for the select dropdown
const { data: campaignsData } = await useFetch('/api/admin/campaigns')
const campaigns = computed(() => campaignsData.value?.body || [])

const form = useForm({
    schema: toTypedSchema(ExamSchema),
    defaultValues: {
        title: '',
        subject: '',
        startTime: '',
        endTime: '',
        duration: '',
        totalMarks: '',
        sequenceOrder: 1,
        shuffleQuestions: false,
        negativeMarking: false,
        yt_class_link: '',
    }
})


const onSubmit = form.handleSubmit(async (data) => {

    try {


        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);


        if (startTime >= endTime) {
            return toast({
                title: "Invalid Start Time",
                description: "Start time must be before end time",
                variant: "destructive"
            });
        }

        if (data.duration <= 0) {
            return toast({
                title: "Invalid Duration",
                description: "Duration must be greater than 0",
                variant: "destructive"
            });
        }

        if (data.totalMarks <= 0) {
            return toast({
                title: "Invalid Total Marks",
                description: "Total marks must be greater than 0",
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
                title: "Error",
                description: error.value.statusMessage || "Failed to create exam",
                variant: 'destructive'
            })
        }

        toast({
            title: "Success",
            description: "Exam created successfully",
        })

        navigateTo('/admin/exams')

    } catch (error) {
        console.error('Error creating exam:', error)
        return toast({
            title: "Error",
            description: error.message || "An unexpected error occurred",
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})



</script>

<style lang="scss" scoped></style>