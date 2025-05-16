<template>
    <Card class="flex flex-col hover:shadow-lg transition-all duration-300 border-2">
        <CardHeader class="bg-gradient-to-r from-primary/5 to-secondary/5 pb-3">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <CardTitle
                    class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {{ exam.title }}
                </CardTitle>
                <div class="flex gap-2">
                    <Badge :class="[
                        exam.status === 'ongoing' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            exam.status === 'upcoming' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                'bg-gray-500/10 text-gray-500 border-gray-500/20'
                    ]" class="px-2 py-0.5 rounded-full text-xs sm:text-sm font-medium border">
                        {{ exam.status.charAt(0).toUpperCase() + exam.status.slice(1) }}
                    </Badge>
                </div>
            </div>
            <p class="mt-1 text-xs sm:text-sm font-medium text-muted-foreground/80">{{ exam.subject }}</p>
        </CardHeader>
        <CardContent class="flex-grow p-4 sm:p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div
                    class="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30 border border-blue-200/50 dark:border-blue-800/30">
                    <div class="flex items-center mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
                        <Icon name="lucide:calendar" class="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Start
                    </div>
                    <div class="ml-5 sm:ml-6 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">{{
                        formatDate(exam.start_time) }}</div>
                </div>
                <div
                    class="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/50 dark:to-red-900/30 border border-red-200/50 dark:border-red-800/30">
                    <div class="flex items-center mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-red-700 dark:text-red-300">
                        <Icon name="lucide:calendar" class="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        End
                    </div>
                    <div class="ml-5 sm:ml-6 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">{{ formatDate(exam.end_time) }}
                    </div>
                </div>
                <div
                    class="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30 border border-green-200/50 dark:border-green-800/30">
                    <div class="flex items-center mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-green-700 dark:text-green-300">
                        <Icon name="lucide:clock" class="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Duration
                    </div>
                    <div class="ml-5 sm:ml-6 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">{{ exam.duration }} minutes
                    </div>
                </div>
                <div
                    class="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/50 dark:to-yellow-900/30 border border-yellow-200/50 dark:border-yellow-800/30">
                    <div class="flex items-center mb-1 sm:mb-2 text-xs sm:text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                        <Icon name="lucide:award" class="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Total Marks
                    </div>
                    <div class="ml-5 sm:ml-6 text-xs sm:text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        {{ exam.total_marks }} x 1 = {{ exam.total_marks }}
                        <span class="text-[10px] sm:text-xs text-yellow-500/80">(-0.25/Wrong Answer)</span>
                    </div>
                </div>
            </div>

            <div v-if="exam.status !== 'past'"
                class="flex flex-col items-center rounded-xl">
                <div class="flex items-center mb-2 text-xs sm:text-sm font-semibold text-primary">
                    <Icon name="lucide:timer" class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <p class="font-bold">পরীক্ষা {{ exam.status === 'ongoing' ? 'শেষ' : 'শুরু' }} হতে সময় বাকি</p>
                </div>

                <div v-if="exam.status == 'ongoing'" class="text-base sm:text-lg font-bold text-primary">
                    <AppTimer :end="exam.end_time" />
                </div>
                <div v-if="exam.status == 'upcoming'" class="text-base sm:text-lg font-bold text-primary">
                    <AppTimer :end="exam.start_time" />
                </div>
            </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-3 pt-0">
            <Button v-if="exam.status === 'ongoing' && (!exam.submission || exam.submission.status === 'pending')"
                @click="navigateTo(`/exam/${exam.id}/onboard`)"
                class="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                Start Exam
            </Button>
            <p v-else-if="exam.status === 'ongoing'" class="text-base sm:text-lg font-bold text-red-500 text-center">
                অংশগ্রহণের জন্য ধন্যবাদ।
            </p>
            <template v-if="exam.status === 'past'">
                <div class="sm:grid hidden grid-cols-3 w-full gap-3">
                    <Button @click="navigateTo(`/exam/${exam.id}/practice`)"
                        class="w-full bg-gradient-to-r  from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                        Practice Exam
                    </Button>
                    <Button @click="navigateTo(`/exam/${exam.id}/solution`)"
                        class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                        Solution
                    </Button>
                    <Button @click="navigateTo(`/exam/${exam.id}/leaderboard`)"
                        class="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                        Leaderboard
                    </Button>
                </div>
                 <div class="sm:hidden w-full gap-3">
                    <div class="w-full mb-3">
                        <Button @click="navigateTo(`/exam/${exam.id}/practice`)"
                        class="w-full bg-gradient-to-r  from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                        Practice Exam
                    </Button>
                    </div>
                   <div class="grid grid-cols-2 gap-3 w-full">
                     <Button @click="navigateTo(`/exam/${exam.id}/solution`)" v-if="new Date(exam.solution_publish_time) < new Date()"
                        class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                        Solution
                    </Button>
                    <Button @click="navigateTo(`/exam/${exam.id}/leaderboard`)" v-if="new Date(exam.result_publish_time) < new Date()"
                        class="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm sm:text-base font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105">
                        Leaderboard
                    </Button>
                   </div>
                </div>
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

<style lang="scss" scoped>
.card {
    @apply transition-all duration-300;

    &:hover {
        @apply transform -translate-y-1;
    }
}
</style>