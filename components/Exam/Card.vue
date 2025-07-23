<template>
    <Card class="relative">
        <CardContent class="p-6">
            <div class="absolute top-4 right-4">
                <span class="text-xs font-medium rounded-full px-2 py-1" :class="[
                    exam.status === 'ongoing' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        exam.status === 'upcoming' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                            'bg-green-100 text-green-800 hover:bg-green-100'
                ]">
                    {{ exam.status === 'ongoing' ? 'চলমান পরীক্ষা' :
                        exam.status === 'upcoming' ? 'পরবর্তী পরীক্ষা' : 'পরীক্ষা শেষ' }}
                </span>
            </div>

            <div class="space-y-4">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ exam.title }}</h3>
                    <p class="text-sm text-gray-600">{{ exam.subject }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center gap-2 bg-[#FAFBFB] p-2 rounded-lg">
                        <Icon name="lucide:calendar" class="w-4 h-4 text-green-600" />
                        <div>
                            <p class="text-sm font-semibold text-gray-900">Exam Start</p>
                            <p class="text-xs text-gray-600">{{ formatDate(exam.start_time) }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 bg-[#FAFBFB] p-2 rounded-lg">
                        <Icon name="lucide:calendar" class="w-4 h-4 text-red-600" />
                        <div>
                            <p class="text-sm font-semibold text-gray-900">Exam End</p>
                            <p class="text-xs text-gray-600">{{ formatDate(exam.end_time) }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 bg-[#FAFBFB] p-2 rounded-lg">
                        <Icon name="lucide:clock" class="w-4 h-4 text-blue-600" />
                        <div>
                            <p class="text-sm font-semibold text-gray-900">Exam Duration</p>
                            <p class="text-xs text-gray-600">{{ exam.duration }} Minutes</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 bg-[#FAFBFB] p-2 rounded-lg">
                        <Icon name="lucide:award" class="w-4 h-4 text-orange-600" />
                        <div>
                            <p class="text-sm font-semibold text-gray-900">Total Marks</p>
                            <p class="text-xs text-gray-600">
                                {{ exam.total_marks }} Marks
                                <span class="text-xs text-gray-500" v-if="exam.negative_marking">(-0.25/Wrong)</span>
                            </p>
                        </div>
                    </div>
                </div>



                <div v-if="exam.status === 'past' && exam.submission && exam.submission.status === 'submitted'"
                    class="mt-4 p-4 bg-[#FAFBFB]  rounded-lg">
                    <div class="flex flex-col items-center text-center">
                        <p class="text-lg font-semibold text-green-600 mb-2">
                            অংশগ্রহণের জন্য ধন্যবাদ
                        </p>
                        <p class="text-sm text-gray-600">
                            প্রাপ্ত নম্বর: {{ exam.submission.marks }}/{{ exam.total_marks }}
                        </p>
                    </div>
                </div>

                <div v-else-if="exam.status === 'past' && !exam.submission"
                    class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div class="flex flex-col items-center text-center">
                        <p class="text-lg font-semibold text-red-500 mb-2">
                            তুমি এই পরীক্ষায় অংশগ্রহণ করোনি!
                        </p>
                        <p class="text-sm text-gray-600">
                            প্রাপ্ত নম্বর: N/A
                        </p>
                    </div>
                </div>

                <div v-if="exam.status === 'ongoing'">

                    <button v-if="!exam.submission || exam.submission.status === 'pending'"
                        @click="navigateTo(`/exam/${exam.id}/onboard`)"
                        class="flex special_effect outline-none border-none text-lg text-center justify-center text-white items-center w-full h-12 font-medium bg-[#008643] shadow-lg rounded-2xl  duration-200 hover:bg-[#007b3a]">
                        পরীক্ষা শুরু করো
                    </button>
                    <p v-else class="text-lg font-semibold text-green-600 text-center">
                        অংশগ্রহণের জন্য ধন্যবাদ।
                    </p>
                </div>

                <div class="grid grid-cols-2 gap-3"
                    v-if="exam.status === 'past' || (exam.submission && exam.submission.status === 'submitted')">
                    <button @click="navigateTo(`/exam/${exam.id}/leaderboard`)"
                        class="flex special_effect outline-none border-none text-lg text-center justify-center text-white items-center w-full h-12 font-medium bg-[#008643] shadow-lg rounded-2xl  duration-200 hover:bg-[#007b3a]">
                        লিডারবোর্ড
                    </button>
                    <button @click="navigateTo(`/exam/${exam.id}/solution`)"
                        class="flex special_effect outline-none border-none text-lg text-center justify-center text-white items-center w-full h-12 font-medium bg-[#008643] shadow-lg rounded-2xl  duration-200 hover:bg-[#007b3a]">
                        সমাধান
                    </button>
                </div>


            </div>
        </CardContent>
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
// Removed custom styles as we're using the cleaner design</style>