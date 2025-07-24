<template>
    <div class="max-w-3xl   mx-auto space-y-4" v-if="status === 'success'">

        <div class="mb-4">
            <h1 class=" text-2xl font-bold text-center text-gray-800">{{ data.exam.title }}</h1>
            <p class="text-sm text-gray-500 text-center">
                {{ data.exam.subject }}
            </p>
        </div>

        <!-- Top Bar with Statistics -->
        <div v-if="data.submission">
            <AppSummary :total_marks="data.exam.total_marks" :obtained_marks="data.submission.marks"
                :correct="data.submission.correct" :incorrect="data.submission.incorrect"
                :skipped="data.submission.skipped"
                :total_not_answered="data.questions.filter(q => notAnswered(q.id)).length"
                :extra_questions="data.questions.filter(q => isExtraQuestion(q.id)).length" />


        </div>


        <div v-else class="p-6 bg-white border rounded-xl shadow-lg">
            <div class="text-center">
                <Icon name="lucide:alert-circle" size="48" class="mx-auto text-yellow-500 mb-4" />
                <h2 class="text-xl font-semibold text-gray-800 mb-2">Not participated</h2>
                <p class="text-gray-600">You have not participated in this exam.</p>
            </div>
        </div>

        <div v-if="data.questions" class="space-y-4">
            <div v-for="(q, i) in data.questions" :key="i" class="p-6 space-y-4 bg-white border rounded-xl shadow-sm">
                <div class="flex items-start justify-between">
                    <div class="text-lg font-semibold text-gray-900" v-html="q.question"></div>
 
                </div>
                <div class="flex flex-wrap gap-2">
                    <Badge class="bg-blue-100 text-blue-800">Q{{ i + 1 }}</Badge>
                    <Badge class="bg-purple-100 text-purple-800">{{ q.subject }}</Badge>
                    <Badge class="bg-green-100 text-green-800">1 Mark</Badge>
                    <Badge v-if="notAnswered(q.id)" class="bg-red-100 text-red-800">Not Answered</Badge>
                </div>
                <div class="mt-4 space-y-3">
                    <div v-for="(a, j) in q.options" :key="j"
                        class="relative flex items-center p-4 space-x-3 transition-all border-2 rounded-lg" :class="{
                            'border-green-500 bg-green-50': a.correct,
                            'border-red-500 bg-red-50': wrongAnswer(a.id) && !a.correct,
                            'border-gray-200 hover:bg-gray-50': !a.correct && !wrongAnswer(a.id)
                        }">
                        <div class="flex-1">
                            <AppMath v-model="a.option_text"></AppMath>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon v-if="a.correct" name="lucide:check-circle-2" size="24" class="text-green-500" />
                            <Icon v-if="wrongAnswer(a.id) && !a.correct" name="lucide:x-circle" size="24"
                                class="text-red-500" />
                            <span v-if="a.correct" class="text-sm font-medium text-green-600">Correct Answer</span>
                            <span v-if="wrongAnswer(a.id) && !a.correct" class="text-sm font-medium text-red-600">Your
                                Answer</span>
                        </div>
                    </div>
                </div>

                <div v-if="q.explain" class="p-4 mt-4 bg-green-50 border border-green-200 rounded-lg">
                    <div class="flex items-center gap-2 mb-2">
                        <Icon name="lucide:lightbulb" size="20" class="text-green-600" />
                        <span class="font-medium text-green-800">Explanation</span>
                    </div>
                    <AppMath v-model="q.explain" class="text-gray-700"></AppMath>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <AppLoader />
    </div>
</template>

<script setup>
const route = useRoute()
const { data, status, error, refresh } = await useFetch('/api/question/' + route.params.id + '/solution', {
    key: 'solution'
})

const wrongAnswer = (optionId) => {
    if (!data.value?.submission?.answers) return false
    return data.value?.submission?.answers?.includes(optionId) || false
}

const notAnswered = (questionId) => {
    if (!data.value?.submission?.answers) return false

    // If the question is extra (not in submission questions), it can't be unanswered
    if (isExtraQuestion(questionId)) return false

    // Find the question
    const question = data.value.questions.find(q => q.id === questionId)
    if (!question) return false

    // Check if any of the question's options are in the answers array
    const hasAnswer = question.options.some(option =>
        data.value.submission.answers.includes(option.id)
    )

    return !hasAnswer
}

const isExtraQuestion = (questionId) => {
    if (!data.value?.submission?.questions) return false
    return !data.value.submission.questions.includes(questionId)
}
</script>

<style lang="scss" scoped></style>