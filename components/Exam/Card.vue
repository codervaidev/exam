<template>
    <Card class="flex flex-col">

        <CardHeader>
            <div class="flex items-center justify-between">
                <CardTitle class="text-xl">{{ exam.title }}</CardTitle>
                <Badge
                    :variant="exam.status === 'ongoing' ? 'destructive' : exam.status === 'upcoming' ? 'secondary' : 'outline'">
                    {{ exam.status.charAt(0).toUpperCase() + exam.status.slice(1) }}
                </Badge>
            </div>
            <p class="mt-1 text-sm text-muted-foreground">{{ exam.subject }}</p>
        </CardHeader>
        <CardContent class="flex-grow">
            <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="p-3 rounded-lg bg-secondary">
                    <div class="flex items-center mb-1 text-sm font-medium">
                        <Icon name="lucide:calendar" class="w-4 h-4 mr-2 text-blue-500" />
                        Start
                    </div>
                    <div class="ml-6 text-xs">{{ formatDate(exam.startTime) }}</div>
                </div>
                <div class="p-3 rounded-lg bg-secondary">
                    <div class="flex items-center mb-1 text-sm font-medium">
                        <Icon name="lucide:calendar" class="w-4 h-4 mr-2 text-red-500" />
                        End
                    </div>
                    <div class="ml-6 text-xs">{{ formatDate(exam.endTime) }}</div>
                </div>
                <div class="p-3 rounded-lg bg-secondary">
                    <div class="flex items-center mb-1 text-sm font-medium">
                        <Icon name="lucide:clock" class="w-4 h-4 mr-2 text-green-500" />
                        Duration
                    </div>
                    <div class="ml-6 text-xs">{{ exam.duration }} minutes</div>
                </div>
                <div class="p-3 rounded-lg bg-secondary">
                    <div class="flex items-center mb-1 text-sm font-medium">
                        <Icon name="lucide:award" class="w-4 h-4 mr-2 text-yellow-500" />
                        Total Marks
                    </div>
                    <div class="ml-6 text-xs">{{ exam.totalMarks }} x 1 = 10</div>
                </div>
            </div>

            <div v-if="exam.status !== 'past'" class="flex flex-col items-center p-3 rounded-lg bg-primary/10">
                <div class="flex items-center mb-2 text-sm font-medium">
                    <Timer class="w-4 h-4 mr-2 text-primary" />
                    <p class="font-semibold text-center "> পরীক্ষা {{ exam.status === 'ongoing' ? 'শেষ' : 'শুরু' }} হতে
                        সময় বাকি
                    </p>
                </div>

                <div v-if="exam.status == 'ongoing'">
                    <AppTimer :end="exam.endTime" />
                </div>
                <div v-if="exam.status == 'upcoming'">
                    <AppTimer :end="exam.startTime" />
                </div>
            </div>
        </CardContent>
        <CardFooter class="flex justify-center space-x-2">

            <Button v-if="exam.status === 'ongoing' && (!exam.submission || exam.submission.status === 'pending')"
                @click="navigateTo(`/exam/${exam.id}/onboard`)">Start Exam</Button>
            <p v-else-if="exam.status === 'ongoing'" class="font-semibold text-green-500">
                Thanks for participation.
            </p>
            <template v-if="exam.status === 'past'">

                <Button @click="navigateTo(`/exam/${exam.id}/practice`)">Pratice Exam</Button>
                <Button @click="navigateTo(`/exam/${exam.id}/solution`)">Solution</Button>
                <Button @click="navigateTo(`/exam/${exam.id}/leaderboard`)">Leaderboard</Button>
            </template>
        </CardFooter>
    </Card>
</template>

<script setup>


const { exam } = defineProps({
    exam: {
        type: Object,
        required: true,
    },
})


</script>

<style lang="scss" scoped></style>