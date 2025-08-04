<template>
    <Card class="relative bg-white rounded-xl shadow-none  transition-shadow duration-300">
        <CardContent class="p-3 sm:p-6">
            <!-- Date Label -->
            <div class="absolute top-4 right-4">
                <div v-if="exam.submission && exam.submission.status === 'submitted'"
                    class="text-sm mt-6 sm:mt-0 inline-block mx-auto rounded-full border py-1 px-2 bg-green-50  border-primary  font-semibold text-green-600 text-center">

                    অংশগ্রহণের জন্য ধন্যবাদ।
                </div>

                <span v-else class="text-xs font-semibold rounded-full px-3 py-1.5" :class="[
                    exam.isLocked ? 'bg-gray-100 text-gray-600' :
                        exam.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                            exam.status === 'upcoming' ? 'bg-blue-100 text-gray-700' :
                                'bg-green-100 text-green-700'
                ]">
                    {{ getDateLabel(exam) }}
                </span>
            </div>

            <div class="space-y-5">
                <!-- Title and Subject -->
                <div class="pt-2">
                    <h3 class=" md:text-xl font-bold text-gray-900 mb-2">{{ exam.title }}</h3>
                    <p class="text-sm text-gray-600">{{ exam.subject }}</p>
                </div>

                <!-- Exam Schedule (for upcoming exams) -->
                <div class="gap-3 grid grid-cols-2">
                    <div class="flex items-center gap-3 bg-secondasy p-3 rounded-lg">
                        <Icon name="lucide:calendar" class="w-4 h-4 text-primary flex-shrink-0" />
                        <div>
                            <p class="text-xs font-semibold text-gray-900">Exam Start</p>
                            <p class="text-xs text-gray-600">{{ formatDate(exam.start_time) }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 bg-secondary p-3 rounded-lg">
                        <Icon name="lucide:calendar" class="w-4 h-4 text-red-600 flex-shrink-0" />
                        <div>
                            <p class="text-xs font-semibold text-gray-900">Exam End</p>
                            <p class="text-xs text-gray-600">{{ formatDate(exam.end_time) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Exam Details -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="flex items-center gap-3 bg-secondary p-3 rounded-lg">
                        <Icon name="lucide:clock" class="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div>
                            <p class="text-xs font-semibold text-gray-900">Exam Duration</p>
                            <p class="text-xs text-gray-600">{{ exam.duration }} Minutes</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 bg-secondary p-3 rounded-lg">
                        <Icon name="lucide:award" class="w-4 h-4 text-orange-600 flex-shrink-0" />
                        <div>
                            <p class="text-xs font-semibold text-gray-900">Total Marks</p>
                            <p class="text-xs text-gray-600">{{ exam.total_marks }} Marks</p>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div v-if="!exam.isLocked" class="grid md:grid-cols-2 gap-3">
                    <button v-if="!exam.submission || exam.submission.status === 'pending'" @click="openExamModal"
                        class="flex items-center justify-center gap-2 w-full h-12 font-semibold bg-primary text-white rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02]">
                        <VideoIcon class="w-4 h-4" />
                        One Shot ক্লাস দেখো
                    </button>
                    <button v-if="!exam.submission || exam.submission.status === 'pending'" @click="openExamModal"
                        class="flex items-center justify-center gap-2 w-full h-12 font-semibold bg-primary text-white rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02]">

                        পরীক্ষা শুরু করো
                    </button>
                </div>

                <div v-else-if="exam.isLocked || exam.status === 'upcoming'" class="mt-4 grid grid-cols-2 gap-3">
                    <button @click="openClass"
                        class="flex items-center justify-center gap-2 w-full h-12 font-semibold bg-primary text-white rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02]">
                        <VideoIcon class="w-4 h-4" />
                        <span class="hidden md:block">
                            One Shot
                        </span> ক্লাস দেখো
                    </button>
                    <button disabled
                        class="flex items-center justify-center gap-2 w-full h-12 font-semibold bg-gray-300 text-gray-600 rounded-xl cursor-not-allowed">
                        <Icon name="lucide:lock" class="w-4 h-4" />
                        পরীক্ষা শুরু করো
                    </button>
                </div>

                <!-- Past Exam Actions -->
                <div class="grid grid-cols-2 gap-3" v-if="(exam.submission && exam.submission.status === 'submitted')">
                    <button @click="openClass"
                        class="flex items-center justify-center gap-2 w-full h-12 font-semibold bg-primary text-white rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02]">
                        <VideoIcon class="w-4 h-4" />
                        <span class="hidden md:block">
                            One Shot
                        </span> ক্লাস দেখো
                    </button>
                    <button @click="showLeaderboard"
                        class="flex items-center justify-center gap-2 w-full h-12 font-semibold bg-primary text-white rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02]"
                        :class="exam.status !== 'past' ? '!bg-gray-400' : ''">
                        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.77002 16V6H4.92302V16H0.77002ZM6.73002 16V0H11.27V16H6.73002ZM13.077 16V8H17.231V16H13.077Z"
                                fill="white" />
                        </svg>
                        লিডারবোর্ড
                    </button>

                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Exam Modal -->
    <ExamModal :exam="exam" :is-open="isModalOpen" @close="closeModal" @start-exam="handleStartExam" />
</template>

<script setup>
import { VideoIcon } from 'lucide-vue-next'
import ExamModal from './Modal.vue'
import { toast } from '../ui/toast'

const { exam } = defineProps({
    exam: {
        type: Object,
        required: true,
    },
})

const isModalOpen = ref(false)

const openExamModal = () => {
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
}

const handleStartExam = (examData) => {
    closeModal()
    // Navigate to the exam onboard page
    navigateTo(`/exam/${examData.id}`)
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const getDateLabel = (exam) => {

    return `Day ${exam.sequence_order}`


}


const openClass = () => {
    window.open(exam.yt_class_link, '_blank')
}

const showLeaderboard = () => {
    if (exam.status == 'past') {
        navigateTo(`/exam/${exam.id}/leaderboard`)
    } else {
        toast({
            title: 'পরীক্ষার সময় শেষ হওয়ার পরেই লিডারবোর্ড দেখা যাবে',
            variant: 'destructive',
        })
    }



}


</script>

<style lang="scss" scoped>
// Clean design without custom styles</style>