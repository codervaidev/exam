<template>
    <div class="w-full px-3 py-6 mx-auto sm:px-4 lg:px-6 max-w-6xl">
        <div class="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-0.5">
                <h1 class="text-xl font-bold tracking-tight">{{ exam.title }}</h1>
                <div class="flex gap-2">
                    <p class="text-sm text-muted-foreground">{{ exam.subject }}</p>
                    <span class="text-sm text-muted-foreground">•</span>
                    <p class="text-sm text-muted-foreground">{{ exam.level }}</p>
                    <span class="text-sm text-muted-foreground">•</span>
                    <p class="text-sm text-primary font-medium">{{ exam.campaign_title || 'No Campaign' }}</p>
                </div>
            </div>
            <div class="flex flex-wrap gap-1.5">
                <Button variant="outline" size="sm" class="hover:bg-primary/10"
                    @click="navigateTo(`/admin/exams/${exam.id}/view`)">
                    <Icon name="heroicons:eye" class="w-3.5 h-3.5 mr-1.5" />
                    View Questions
                </Button> <Button variant="outline" size="sm" class="hover:bg-primary/10"
                    @click="navigateTo(`/admin/leaderboards/${exam.id}`)">
                    <Icon name="heroicons:trophy" class="w-3.5 h-3.5 mr-1.5" />
                    Leaderboard
                </Button>
                <Button variant="outline" size="sm" class="hover:bg-primary/10"
                    @click="navigateTo(`/admin/exams/${exam.id}`)">
                    <Icon name="heroicons:document-text" class="w-3.5 h-3.5 mr-1.5" />
                    Questions
                </Button>
                <Button @click="onEdit(exam)" variant="outline" size="sm" class="hover:bg-primary/10">
                    <Icon name="heroicons:pencil-square" class="w-3.5 h-3.5 mr-1.5" />
                    Edit
                </Button>
                <Button variant="destructive" size="sm" class="hover:bg-destructive/90" @click="deleteExam(exam.id)">
                    <Icon name="heroicons:trash" class="w-3.5 h-3.5 mr-1.5" />
                    Delete
                </Button>
            </div>
        </div>
        <Card class="overflow-hidden">
            <CardHeader class="bg-muted/50 py-3">
                <CardTitle class="text-base">Exam Details</CardTitle>
                <CardDescription class="text-xs">Comprehensive information about the exam</CardDescription>
            </CardHeader>
            <CardContent class="p-4">
                <div class="grid gap-4">
                    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div class="p-3 rounded-lg bg-muted/30">
                            <Label class="text-xs font-medium">Campaign</Label>
                            <p class="mt-0.5 text-xs text-muted-foreground">{{ exam.campaign_title || 'No Campaign' }}
                            </p>
                        </div>
                        <div class="p-3 rounded-lg bg-muted/30">
                            <Label class="text-xs font-medium">Level</Label>
                            <p class="mt-0.5 text-xs text-muted-foreground">{{ exam.level }}</p>
                        </div>
                        <div class="p-3 rounded-lg bg-muted/30">
                            <Label class="text-xs font-medium">Duration</Label>
                            <p class="mt-0.5 text-xs text-muted-foreground">{{ exam.duration }} Minutes</p>
                        </div>
                        <div class="p-3 rounded-lg bg-muted/30">
                            <Label class="text-xs font-medium">Total Marks</Label>
                            <p class="mt-0.5 text-xs text-muted-foreground">{{ exam.total_marks }} Marks</p>
                        </div>
                    </div>

                    <Separator class="my-2" />

                    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div class="p-3 rounded-lg bg-muted/30">
                            <Label class="text-xs font-medium">Start Time</Label>
                            <p class="mt-0.5 text-xs text-muted-foreground">{{ formatTime(exam.start_time) }}</p>
                        </div>
                        <div class="p-3 rounded-lg bg-muted/30">
                            <Label class="text-xs font-medium">End Time</Label>
                            <p class="mt-0.5 text-xs text-muted-foreground">{{ formatTime(exam.end_time) }}</p>
                        </div>
                        <div class="p-3 rounded-lg bg-muted/30">
                            <Label class="text-xs font-medium">Result Publish Time</Label>
                            <p class="mt-0.5 text-xs text-muted-foreground">{{ formatTime(exam.result_publish_time)
                                }}
                            </p>
                        </div>
                        <div class="p-3 rounded-lg bg-muted/30">
                            <Label class="text-xs font-medium">Solution Publish Time</Label>
                            <p class="mt-0.5 text-xs text-muted-foreground">{{
                                formatTime(exam.solution_publish_time) }}
                            </p>
                        </div>


                    </div>




                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
const props = defineProps({
    exam: {
        type: Object,
    },
})

const { onEdit } = useExam()

const deleteExam = async (id) => {
    if (confirm('Are you sure you want to delete this exam?')) {
        await $fetch(`/api/admin/exam/${id}`, {
            method: 'DELETE'
        })
        refreshNuxtData('admin-exams')
    }
}
</script>

<style lang="scss" scoped>
.card {
    @apply transition-all duration-200;

    &:hover {
        @apply shadow-md;
    }
}
</style>