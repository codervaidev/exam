<template>
    <AppHero />
    <AppContainer>
        <div v-if="status === 'success'" class="space-y-8 relative py-5">
            <!-- Ongoing Exams Section -->
            <div v-if="data.body.length > 0" class="space-y-6">
                <div class="grid gap-6 md:grid-cols-2 mx-auto">
                    <ExamCard v-for="exam in data.body" :key="exam.id" :exam="exam" />
                </div>
            </div>


            <!-- Empty State -->
            <AppEmptyState v-if="data.body.length === 0" title="No exam scheduled" />
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
    key: 'exams'
})
</script>

<style lang="scss" scoped></style>