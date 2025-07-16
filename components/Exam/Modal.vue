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
                <FormField v-slot="{ componentField }" name="campaignId">
                    <FormItem>
                        <FormLabel>Campaign</FormLabel>
                        <FormControl>
                            <Select v-bind="componentField">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select campaign" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="campaign in campaigns" :key="campaign.id" :value="campaign.id">
                                        {{ campaign.title }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="level">
                    <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                            <Select v-bind="componentField">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="6">6</SelectItem>
                                    <SelectItem value="7">7</SelectItem>
                                    <SelectItem value="8">8</SelectItem>
                                    <SelectItem value="9">9</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
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

// Fetch campaigns for the select dropdown
const { data: campaignsData } = await useFetch('/api/admin/campaigns')
const campaigns = computed(() => campaignsData.value?.body || [])

const form = useForm({
    schema: toTypedSchema(ExamSchema),
    defaultValues: {
        title: '',
        subject: '',
        level: '',
        campaignId: '',
        startTime: '',
        endTime: '',
        duration: '',
        totalMarks: '',
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
        // Manual validation for publish times
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);


        if (startTime >= endTime) {
            return toast({
                title: "Invalid Start Time",
                description: "Start time must be before end time",
                variant: "destructive"
            });
        }

        isLoading.value = true
        if (initialExam.value.id) {
            const { error } = await useFetch(`/api/admin/exam/${initialExam.value.id}`, {
                method: 'PUT',
                body: {
                    ...data,
                    startTime: (data.startTime),
                    endTime: (data.endTime),
                    resultPublishTime: dateFieldFormat(data.endTime),
                    solutionPublishTime: dateFieldFormat(data.endTime)
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
            body: {
                ...data,
                startTime: dateFieldFormat(data.startTime),
                endTime: dateFieldFormat(data.endTime),
                resultPublishTime: dateFieldFormat(data.resultPublishTime),
                solutionPublishTime: dateFieldFormat(data.solutionPublishTime)
            }
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
            level: value.level,
            campaignId: value.campaign_id,
            startTime: dateFieldFormat(value.start_time),
            endTime: dateFieldFormat(value.end_time),
            duration: value.duration,
            totalMarks: value.total_marks,
            resultPublishTime: dateFieldFormat(value.result_publish_time),
            solutionPublishTime: dateFieldFormat(value.solution_publish_time),
            shuffleQuestions: value.shuffle_questions,
            negativeMarking: value.negative_marking,
            data: {
                hard: value.data?.hard || 0,
                medium: value.data?.medium || 0,
                easy: value.data?.easy || 0
            }
        })
    }
}, { immediate: true })


// spob update the data

</script>

<style lang="scss" scoped></style>