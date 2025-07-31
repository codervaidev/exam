<template>
    <AppHero />
    <AppContainer>
        <div v-if="status === 'success'" class="space-y-8 relative py-5">

            <div class="flex justify-between items-center">

                <h1 class=" sm:text-2xl font-bold">
                    চলমান পরীক্ষা
                </h1>
                <button @click="navigateTo('/leaderboard')"
                    class="bg-[#0086431A] text-green-600 flex gap-2 items-center px-4 py-2 rounded-full text-sm sm:text-base">

                    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0.77002 16.5V6.5H4.92302V16.5H0.77002ZM6.73002 16.5V0.5H11.27V16.5H6.73002ZM13.077 16.5V8.5H17.231V16.5H13.077Z"
                            fill="#008643" />
                    </svg>
                    ক্যাম্পেইন লিডারবোর্ড

                    <ChevronRightIcon class="w-4 h-4" />
                </button>

            </div>
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
import { ChevronRightIcon } from 'lucide-vue-next';


definePageMeta({
    middleware: ['protected']
})


const route = useRoute()

const { data, status, error, refresh } = await useLazyFetch('/api/exams', {
    key: 'exams'
})
</script>

<style lang="scss" scoped></style>