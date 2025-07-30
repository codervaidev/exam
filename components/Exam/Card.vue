<template>
    <Card class="relative bg-white rounded-xl shadow-none  transition-shadow duration-300">
        <CardContent class="p-6">
            <!-- Date Label -->
            <div class="absolute top-4 right-4">
                <span class="text-xs font-semibold rounded-full px-3 py-1.5" :class="[
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
                    <h3 class="text-xl font-bold text-gray-900 mb-2">{{ exam.title }}</h3>
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
                <div v-if="!exam.isLocked">
                    <button v-if="!exam.submission || exam.submission.status === 'pending'" @click="openExamModal"
                        class="flex items-center justify-center gap-2 w-full h-12 font-semibold bg-primary text-white rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02]">

                        পরীক্ষা শুরু করো
                    </button>
                    <p v-else class="text-sm font-semibold text-green-600 text-center">
                        অংশগ্রহণের জন্য ধন্যবাদ।
                    </p>
                </div>

                <div v-else-if="exam.isLocked || exam.status === 'upcoming'" class="mt-4">
                    <button disabled
                        class="flex items-center justify-center gap-2 w-full h-12 font-semibold bg-gray-300 text-gray-600 rounded-xl cursor-not-allowed">
                        <Icon name="lucide:lock" class="w-4 h-4" />
                        পরীক্ষা শুরু করো
                    </button>
                </div>

                <!-- Past Exam Actions -->
                <div class=" hidden grid-cols-2 gap-3"
                    v-if="exam.status === 'past' || (exam.submission && exam.submission.status === 'submitted')">
                    <button @click="navigateTo(`/exam/${exam.id}/leaderboard`)"
                        class="flex items-center justify-center w-full h-10 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                        লিডারবোর্ড
                    </button>
                    <button @click="navigateTo(`/exam/${exam.id}/solution`)"
                        class="flex items-center justify-center w-full h-10 font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                        সমাধান
                    </button>
                </div>
            </div>
        </CardContent>
    </Card>

    <!-- Exam Modal -->
    <ExamModal :exam="exam" :is-open="isModalOpen" @close="closeModal" @start-exam="handleStartExam" />
</template>

<script setup>
import ExamModal from './Modal.vue'

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

    if (exam.status === 'upcoming') {
        return `Day ${exam.sequence_order}`;
    } else if (exam.sequence_order) {
        const start_date = new Date(exam.start_time).getDate()
        console.log(exam);

        return `${start_date} তারিখের পরীক্ষা`
    } else {
        return 'পরীক্ষা শেষ'
    }


}
</script>

<style lang="scss" scoped>
// Clean design without custom styles</style>