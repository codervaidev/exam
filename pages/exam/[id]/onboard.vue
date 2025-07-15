<template>
    <div v-if="status === 'success'" class="container relative p-2 sm:p-2 mx-auto">
        <div class="max-w-2xl  mx-auto my-8 transition-all duration-300  rounded-xl">
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
                <div class="grid grid-cols-1 gap-3 p-2 sm:p-4 bg-gray-50 rounded-lg">
                    <!-- Start Time -->
                    <div class=" flex items-center justify-between p-3 bg-white rounded-lg">
                        <div class="flex items-center space-x-2">
                            <Icon name="lucide:calendar" class="w-5 h-5 text-blue-500" />
                            <h2 class="text-sm sm:text-base font-medium text-gray-700">
                                এক্সাম শুরু:
                            </h2>
                        </div>
                        <p class="text-sm sm:text-base font-medium text-gray-800">
                            {{ formatDate(data.exam.start_time) }}
                        </p>
                    </div>

                    <!-- End Time -->
                    <div class="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div class="flex items-center space-x-2">
                            <Icon name="lucide:calendar" class="w-5 h-5 text-red-500" />
                            <h2 class="text-sm sm:text-base font-medium text-gray-700">
                                এক্সাম শেষ:
                            </h2>
                        </div>
                        <p class="text-sm sm:text-base font-medium text-gray-800">
                            {{ formatDate(data.exam.end_time) }}
                        </p>
                    </div>

                    <!-- Duration -->
                    <div class="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div class="flex items-center space-x-2">
                            <Icon name="lucide:clock" class="w-5 h-5 text-emerald-500" />
                            <h2 class="text-sm sm:text-base font-medium text-gray-700">
                                সময়সীমা:
                            </h2>
                        </div>
                        <p class="text-sm sm:text-base font-medium text-gray-800">
                            {{ data.exam.duration }} মিনিট
                        </p>
                    </div>

                    <!-- Marking -->
                    <div class="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div class="flex items-center space-x-2">
                            <Icon name="lucide:star" class="w-5 h-5 text-emerald-500" />
                            <h2 class="text-sm sm:text-base font-medium text-gray-700">
                                পূর্ণমান:
                            </h2>
                        </div>
                        <p class="text-sm sm:text-base font-medium text-gray-800">
                            {{ data.exam.total_marks }} মার্ক
                        </p>
                    </div>
                </div>
                <!-- Warning Message -->
                <!-- <div
                    class="flex items-center justify-center p-4 space-x-3 text-white rounded-lg bg-gradient-to-r from-rose-500 to-rose-600">
                    <Icon name="lucide:alert-circle" size="20" />
                    <p class="text-sm sm:text-base font-medium">
                        ভুলে বা নেটের সমস্যায় বা অন্য যেকোনো কারণে পরীক্ষা থেকে বের হয়ে গেলে, আবার প্রথম থেকে এক্সাম
                        দিতে হবে এবং সাবমিট না করেই বের হয়ে গেলে, এক্সামে অনুপস্থিত ধরে নেয়া হবে।
                    </p>
                </div> -->

                <!-- Start Button -->
                <div class="flex justify-center mt-6">

                    <button @click="navigateTo('/exam/' + data.exam.id)"
                        class="flex special_effect outline-none border-none text-lg text-center justify-center text-white items-center w-full h-12 font-medium bg-[#008643] shadow-lg rounded-2xl  duration-200 hover:bg-[#007b3a]">
                        শুরু করো
                        <ChevronRight class="w-4 h-4 ml-2" />
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
import { ChevronRight } from 'lucide-vue-next';

definePageMeta({
    middleware: 'protected'
})

const route = useRoute()

const { data, status, error, refresh } = await useFetch('/api/exams/' + route.params.id, {
})
</script>

<style lang="scss" scoped></style>