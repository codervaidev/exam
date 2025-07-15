<template>
    <AppHero />
    <AppContainer>
        <div v-if="status === 'success'" class="space-y-8 relative py-5">
            <!-- Ongoing Exams Section -->
            <div v-if="data.body.ongoingExams.length > 0" class="space-y-6">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">চলমান পরীক্ষা</h2>
                <div class="grid gap-6 md:grid-cols-2 mx-auto">
                    <ExamCard v-for="exam in data.body.ongoingExams" :key="exam.id" :exam="exam" />
                </div>
            </div>

            <!-- Upcoming Exams Section -->
            <div v-if="data.body.upcomingExams.length > 0" class="space-y-6">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">পরবর্তী পরীক্ষা</h2>
                <div class="grid gap-6 md:grid-cols-2 mx-auto">
                    <ExamCard v-for="exam in data.body.upcomingExams" :key="exam.id" :exam="exam" />
                </div>
            </div>

            <!-- Past Exams Section -->
            <div v-if="data.body.pastExams.length > 0" class="space-y-6">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">পূর্ববর্তী পরীক্ষা</h2>
                <div class="grid gap-6 md:grid-cols-2 mx-auto">
                    <ExamCard v-for="exam in data.body.pastExams" :key="exam.id" :exam="exam" />
                </div>
            </div>

            <!-- Empty State -->
            <AppEmptyState
                v-if="data.body.ongoingExams.length === 0 && data.body.upcomingExams.length === 0 && data.body.pastExams.length === 0"
                title="No exam scheduled" />
        </div>
        <div v-else class="py-8">
            <AppLoader />
        </div>
    </AppContainer>
</template>

<script setup>

definePageMeta({
    middleware: ['protected']
})


const route = useRoute()

const { data, status, error, refresh } = await useLazyFetch('/api/exams', {
    key: 'exams',
    query: {
        campaign: route.query.campaign
    }
})
</script>

<style lang="scss" scoped></style>