<template>
    <div class="w-full px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-xl font-bold">{{ exam.title }}</h1>
                <p class="text-muted-foreground">{{ exam.subject }}</p>

            </div>
            <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="navigateTo(`/admin/leaderboards/${exam.id}`)">
                    Leaderboard
                </Button>
                <Button variant="outline" size="sm" @click="navigateTo(`/admin/exams/${exam.id}`)">
                    Questions
                </Button>
                <Button @click="onEdit(exam)" variant="outline" size="sm">
                    Edit
                </Button>
                <Button variant="destructive" size="sm" @click="deleteExam(exam.id)">
                    Delete
                </Button>
            </div>
        </div>
        <Card class="pt-5">
            <CardContent class="grid gap-4">
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    <div class="grid gap-1">
                        <Label>Start Time</Label>
                        <p class="text-xs text-muted-foreground">{{ formatTime(exam.start_time) }}</p>
                    </div>
                    <div class="grid gap-1">
                        <Label>End Time</Label>
                        <p class="text-xs text-muted-foreground">{{ formatTime(exam.end_time) }}</p>
                    </div>
                    <div class="grid gap-1">
                        <Label>Duration</Label>
                        <p class="text-xs text-muted-foreground">{{ exam.duration }} Minutes</p>
                    </div>
                    <div class="grid gap-1">
                        <Label>Total Marks</Label>
                        <p class="text-xs text-muted-foreground">{{ exam.total_marks }} Marks</p>
                    </div>
                    <div class="grid gap-1">
                        <Label>Result Publish Time</Label>
                        <p class="text-xs text-muted-foreground">{{ formatTime(exam.result_publish_time) }}</p>
                    </div>
                    <div class="grid gap-1">
                        <Label>Solution Publish Time</Label>
                        <p class="text-xs text-muted-foreground">{{ formatTime(exam.solution_publish_time) }}</p>
                    </div>
                </div>
                <Separator />
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    <div class="grid gap-1">
                        <Label>Created At</Label>
                        <p class="text-xs text-muted-foreground">{{ formatTime(exam.created_at) }}</p>
                    </div>
                    <div class="grid gap-1">
                        <Label>Updated At</Label>
                        <p class="text-xs text-muted-foreground">{{ formatTime(exam.updated_at) }}</p>
                    </div>
                    <div class="grid gap-1">
                        <Label>Negative Marking</Label>
                        <p class="text-xs text-muted-foreground">{{ exam.negative_marking ? 'Yes' : 'No' }}</p>
                    </div>
                    <div class="grid gap-1">
                        <Label>Shuffle Questions</Label>
                        <p class="text-xs text-muted-foreground">{{ exam.shuffle_questions ? 'Yes' : 'No' }}</p>
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
    }
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

<style lang="scss" scoped></style>