<template>
    <div v-if="status === 'success'" class="container relative p-4 mx-auto">
        <div class="max-w-2xl bg-white/80 p-6 mx-auto my-8 transition-all duration-300 border rounded-xl">
            <div class="space-y-6">


                <!-- Exam Title -->
                <div class="text-center">
                    <h1 class="text-3xl font-bold text-gray-800">
                        {{ data.exam.title }}
                    </h1>
                    <p class="text-lg font-medium text-gray-600">
                        {{ data.exam.subject }}
                    </p>
                </div>

                <!-- Exam Details -->
                <div class="grid grid-cols-1 gap-3 p-4 bg-gray-50 rounded-lg">
                    <!-- Start Time -->
                    <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div class="flex items-center space-x-2">
                            <Icon name="lucide:calendar" class="w-5 h-5 text-blue-500" />
                            <h2 class="text-base font-semibold text-gray-700">
                                এক্সাম শুরু:
                            </h2>
                        </div>
                        <p class="text-lg font-medium text-gray-800">
                            {{ formatDate(data.exam.start_time) }}
                        </p>
                    </div>

                    <!-- End Time -->
                    <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div class="flex items-center space-x-2">
                            <Icon name="lucide:calendar" class="w-5 h-5 text-red-500" />
                            <h2 class="text-base font-semibold text-gray-700">
                                এক্সাম শেষ:
                            </h2>
                        </div>
                        <p class="text-lg font-medium text-gray-800">
                            {{ formatDate(data.exam.end_time) }}
                        </p>
                    </div>

                    <!-- Duration -->
                    <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div class="flex items-center space-x-2">
                            <Icon name="lucide:clock" class="w-5 h-5 text-emerald-500" />
                            <h2 class="text-base font-semibold text-gray-700">
                                সময়সীমা:
                            </h2>
                        </div>
                        <p class="text-lg font-medium text-gray-800">
                            {{ data.exam.duration }} মিনিট
                        </p>
                    </div>

                    <!-- Marking -->
                    <div class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div class="flex items-center space-x-2">
                            <Icon name="lucide:star" class="w-5 h-5 text-emerald-500" />
                            <h2 class="text-base font-semibold text-gray-700">
                                পূর্ণমান:
                            </h2>
                        </div>
                        <p class="text-lg font-medium text-gray-800">
                            {{ data.exam.total_marks }} মার্ক
                        </p>
                    </div>
                </div>
                <!-- Warning Message -->
                <div
                    class="flex items-center justify-center p-4 space-x-3 text-white rounded-lg bg-gradient-to-r from-rose-500 to-rose-600">
                    <Icon name="lucide:alert-circle" size="20" />
                    <p class="text-sm font-medium">
                        ভুলে বা নেটের সমস্যায় বা অন্য যেকোনো কারণে পরীক্ষা থেকে বের হয়ে গেলে, আবার প্রথম থেকে এক্সাম
                        দিতে হবে এবং সাবমিট না করেই বের হয়ে গেলে, এক্সামে অনুপস্থিত ধরে নেয়া হবে।
                    </p>
                </div>

                <!-- Start Button -->
                <div class="flex justify-center mt-6">
                    <button @click="navigateTo('/exam/' + data.exam.id)"
                        class="relative px-10 py-3 text-base font-semibold text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 group">
                        <span class="relative z-10 flex items-center gap-2">
                            শুরু করো
                            <Icon name="lucide:play" class="w-4 h-4" />
                        </span>
                        <div
                            class="absolute inset-0 w-full h-full transition-opacity duration-300 rounded-full bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100">
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center w-full h-screen">
        <AppLoader />
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'protected'
})

const route = useRoute()

const { data, status, error, refresh } = await useFetch('/api/exams/' + route.params.id, {
})
</script>

<style lang="scss" scoped></style>