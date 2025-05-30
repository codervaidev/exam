<template>

    <div class="min-h-screen">
        <div
            class="fixed inset-0 -z-10 h-full  w-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        </div>
        <header class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <AppContainer>
                <div class="container flex items-center justify-between px-2 py-4 mx-auto md:px-4">
                    <NavbarLogo :class="isSubmitted ? '' : 'hidden sm:block'" />
                    <div class="flex items-center flex-1 space-x-4"
                        :class="isSubmitted ? 'justify-end' : 'justify-between'">
                        <div v-if="end_time && !isSubmitted" class="flex gap-4 text-lg font-semibold text-slate-800">
                            <!-- Time Left: -->
                            <ExamTimer :end_time="end_time" />

                        </div>

                        <Button @click="isSubmitted ? retryExam() : submitAns()"
                            class="px-6 py-3 text-lg font-medium text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-violet-500 to-purple-500 hover:from-purple-500 hover:to-violet-500 hover:shadow-lg active:scale-95">
                            <span class="flex items-center gap-2">
                                <Icon :name="isSubmitted ? 'lucide:refresh-cw' : 'lucide:check-circle'" size="20" />
                                {{ isSubmitted ? 'Retry Exam' : 'Submit Exam' }}
                            </span>
                        </Button>
                    </div>
                </div>
            </AppContainer>
            <Progress v-model="progress" class="w-full rounded-none " />
        </header>

        <div class="my-4" v-if="status === 'success'">
            <h1 class=" text-2xl font-bold text-center text-gray-800">{{ data.exam.title }}</h1>
            <p class="text-sm text-gray-500 text-center">
                {{ data.exam.subject }}
            </p>
        </div>

        <!-- New summary section -->
        <div v-if="isSubmitted" class="max-w-3xl mx-auto">

            <AppSummary :total_marks="data.exam.total_marks" :obtained_marks="score" :correct="correctCount"
                :incorrect="wrongCount" :skipped="notAnsweredCount" />

        </div>


        <div class="max-w-3xl mt-2  mx-auto space-y-4  md:space-y-6" v-if="status === 'success'">

            <div v-for="(q, i) in data.questions" :key="i"
                class="p-3 mx-2 space-y-3 bg-white border rounded-lg shadow-md md:p-6">

                <div class="text-lg font-semibold text-gray-900 " v-html="q.question"></div>

                <div class="flex flex-wrap justify-between gap-3 ">
                    <div class="flex gap-3">
                        <Badge> প্রশ্ন নংঃ {{ formatNumber(i + 1) }}</Badge>
                        <Badge> {{ q.subject }}</Badge>
                        <Badge> ১ নম্বর</Badge>

                    </div>
                    <!-- New badge for question status -->
                    <Badge v-if="isSubmitted" class="justify-self-end" :class="{
                        'bg-green-500': isCorrect(q),
                        'bg-red-500': isWrong(q),
                        'bg-gray-500': !q.selected
                    }">
                        {{ getQuestionStatus(q) }}
                    </Badge>
                </div>
                <div class="mt-3 space-y-3 ">

                    <div v-for="(a, j) in q.options" :key="j"
                        class="flex items-center p-3 space-x-2 text-gray-900 transition-colors border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        :class="{
                            'border-slate-500': !isSubmitted && data.questions[i].selected == a.id,
                            'border-red-500': isSubmitted && data.questions[i].selected == a.id && !a.correct,
                            'border-green-500': isSubmitted && a.correct
                        }" @click="!isSubmitted && selectOption(i, a.id)">



                        <AppMath v-model="a.option_text"></AppMath>
                    </div>
                    <div v-if="q.explain && isSubmitted"
                        class="p-4 mt-4 bg-green-50 border border-green-200 rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                            <Icon name="lucide:lightbulb" size="20" class="text-green-600" />
                            <span class="font-medium text-green-800">Explanation</span>
                        </div>
                        <AppMath v-model="q.explain" class="text-gray-700"></AppMath>
                    </div>
                </div>
                <p class="flex items-center mt-4 text-green-600" v-if="q.selected && !isSubmitted">
                    <Icon name="lucide:circle-check" class="w-4 h-4 mr-2" />
                    Answer selected
                </p>
            </div>
        </div>

        <div v-else>
            <AppLoader />
        </div>

        <Dialog :open="showResultDialog" @update:open="showResultDialog = $event">
            <DialogContent class="text-center">

                <div class="py-8">
                    <Icon name="lucide:trophy" class="w-20 h-20 mx-auto text-yellow-400" />
                    <p class="mt-4 text-4xl font-bold text-primary">
                        {{ score }} / {{ data.questions.length }}
                    </p>
                    <p class="mt-2 text-xl text-gray-600">Great job!</p>
                </div>
                <DialogFooter class="flex justify-center gap-4">
                    <Button @click="retryExam" class="bg-gray-500 hover:bg-gray-600">Retry Exam</Button>
                    <Button @click="showDetails" class=" bg-primary hover:bg-primary-dark">View
                        Details</Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>

</template>

<script setup>

definePageMeta({
    layout: 'blank'
})


import { useToast } from '@/components/ui/toast/use-toast'


const route = useRoute()

const { data, status, error, refresh } = await useFetch('/api/question/' + route.params.id + '/qa', {
    key: 'questions'
})


const timer = useLocalStorage('timer', null)

const { toast } = useToast()
const end_time = ref(null)
const isSubmitted = ref(false)
const score = ref(0)
const submitAns = async () => {
    try {
        // Calculate score
        score.value = data.value.questions.filter(q => q.selected).reduce((acc, q) => {
            const ans = q.options.find(o => o.id === q.selected)
            if (ans.correct) {
                return acc + 1
            } else if (ans.correct === false) {
                if (data.value.exam.negative_marking) {
                    return acc - 0.25
                }
            }
            return acc
        }, 0)

        clearTimeout(timer.value)
        timer.value = null
        isSubmitted.value = true

        // Show the result dialog instead of toast
        showResultDialog.value = true
    } catch (error) {
        toast({
            title: 'Error',
            variant: 'destructive'
        })
    }
}

const retryExam = () => {
    // Reset the exam state
    data.value.questions.forEach(q => {
        q.selected = null
    })
    score.value = 0
    showResultDialog.value = false
    isSubmitted.value = false
    end_time.value = new Date().getTime() + (data.value.exam.duration * 60 * 1000)

    // Restart the timer
    if (!timer.value) {
        timer.value = setInterval(() => {
            const now = new Date().getTime()
            const distance = end_time.value - now
            if (distance < 0) {
                clearInterval(timer.value)
                timer.value = null
                submitAns()
            }
        }, 1000)
    }
}

const selectOption = (idx, a_id) => {
    if (!isSubmitted.value) {
        data.value.questions[idx].selected = a_id
    }
}

const progress = computed(() => {

    if (status.value !== 'success') return 0
    return data.value.questions.filter(q => q.selected).length / data.value.questions.length * 100
})

const showResultDialog = ref(false)

onMounted(() => {

    end_time.value = new Date().getTime() + (data.value.exam.duration * 60 * 1000)

    if (!timer.value) {
        timer.value = setInterval(() => {
            const now = new Date().getTime()
            const distance = end_time.value - now
            if (distance < 0) {
                clearInterval(timer.value)
                timer.value = null
                submitAns()
            }
        }, 1000)
    }
})

// Add these new functions
const isCorrect = (question) => {
    return question.selected && question.options.find(o => o.id === question.selected)?.correct
}

const isWrong = (question) => {
    return question.selected && !question.options.find(o => o.id === question.selected)?.correct
}

const getQuestionStatus = (question) => {
    if (!question.selected) return 'Not Answered'
    return isCorrect(question) ? 'Correct' : 'Wrong'
}

// Add these new computed properties
const correctCount = computed(() => {
    if (!isSubmitted.value) return 0
    return data.value.questions.filter(q => isCorrect(q)).length
})

const wrongCount = computed(() => {
    if (!isSubmitted.value) return 0
    return data.value.questions.filter(q => isWrong(q)).length
})

const notAnsweredCount = computed(() => {
    if (!isSubmitted.value) return 0
    return data.value.questions.filter(q => !q.selected).length
})

// Add this new computed property
const subjectScores = computed(() => {
    if (!isSubmitted.value || !data.value) return []

    const subjects = {}
    data.value.questions.forEach(q => {
        if (!subjects[q.subject.name]) {
            subjects[q.subject.name] = { correct: 0, total: 0 }
        }
        subjects[q.subject.name].total++
        if (isCorrect(q)) {
            subjects[q.subject.name].correct++
        }
    })

    return Object.entries(subjects).map(([name, scores]) => ({
        name,
        score: scores.correct,
        total: scores.total
    }))
})

const showDetails = () => {
    showResultDialog.value = false

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

</script>

<style lang="scss" scoped></style>