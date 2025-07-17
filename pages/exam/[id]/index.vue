<template>

    <div>


        <header class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <AppContainer>
                <div class="container flex items-center justify-between px-2 py-4 mx-auto md:px-4">
                    <h1 class="hidden text-xl font-bold text-gray-800 md:block">{{ data.exam.title }}</h1>
                    <div class="flex items-center justify-between flex-1 space-x-4 md:justify-end">
                        <div v-if="end_time" class="flex gap-4 text-lg font-semibold text-slate-800">
                            <!-- Time Left: -->
                            <ExamTimer :end_time="end_time" />
                        </div>

                        <div>
                            <button @click="submitAns"
                                class="flex special_effect outline-none border-none  text-center justify-center text-white items-center w-full h-12 font-medium bg-[#008643] shadow-lg rounded-2xl px-4 duration-200 hover:bg-[#007b3a]">
                                সাবমিট করো
                            </button>
                        </div>
                    </div>
                </div>
            </AppContainer>
            <Progress v-model="progress" class="w-full rounded-none " />
        </header>
        <div class="max-w-2xl py-5 mx-auto space-y-4 md:py-10 md:space-y-6" v-if="status === 'success'">
            <div class="mb-4">
                <h1 class=" text-2xl font-bold text-center text-gray-800">{{ data.exam.title }}</h1>
                <p class="text-sm text-gray-500 text-center">
                    {{ data.exam.subject }}
                </p>
            </div>

            <div v-for="(q, i) in data.questions" :key="i"
                class="p-3 mx-2 space-y-3 bg-white border rounded-lg  md:p-6">

                <div class="text-lg font-semibold text-gray-900 " v-html="q.question"></div>

                <div class="flex flex-wrap gap-3 ">
                    <Badge> Q no. {{ i + 1 }}</Badge>
                    <Badge> {{ q.subject }}</Badge>
                    <Badge> 1 Marks</Badge>
                </div>
                <div class="mt-3 space-y-3 ">

                    <div v-for="(a, j) in q.options" :key="j"
                        class="flex items-center p-3 space-x-2 transition-colors border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        :class="{ 'border-slate-500': data.questions[i].selected == a.id }"
                        @click="selectOption(i, a.id)">


                        <AppMath v-model="a.option_text">
                        </AppMath>
                    </div>
                </div>
                <p class="flex items-center mt-4 text-green-600" v-if="q.selected">
                    <Icon name="lucide:circle-check" class="w-4 h-4 mr-2" />
                    Answer selected
                </p>
            </div>
        </div>

        <div v-else>
            <AppLoader />
        </div>
        <AppModal :isOpen="submittedModal" @onClose="submittedModal = false">
            <div class="flex flex-col items-center justify-center p-6">
                <!-- Success State -->
                <div v-if="submissionState === 'success'" class="text-center">
                    <Icon name="lucide:check-circle" class="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h1 class="text-2xl font-bold text-green-600 mb-2">Submitted Successfully!</h1>
                    <p class="text-sm text-gray-500">Your answers have been submitted successfully</p>
                    <p class="text-xs text-gray-400 mt-2">Redirecting to home page...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="submissionState === 'error'" class="text-center">
                    <Icon name="lucide:x-circle" class="w-16 h-16 mx-auto mb-4 text-red-500" />
                    <h1 class="text-2xl font-bold text-red-600 mb-2">Submission Failed</h1>
                    <p class="text-sm text-gray-500 mb-4">Failed to submit your answers. Please try again.</p>
                    <div class="flex gap-2">
                        <button @click="submittedModal = false"
                            class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                            Close
                        </button>
                        <button @click="submittedModal = false; submitAns()"
                            class="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                            Try Again
                        </button>
                    </div>
                </div>

                <!-- Submitting State -->
                <div v-else-if="submissionState === 'submitting'" class="text-center">
                    <AppLoader />
                    <h1 class="text-2xl font-bold text-blue-600 mb-2 mt-4">Submitting...</h1>
                    <p class="text-sm text-gray-500">Please wait while we submit your answers</p>
                </div>
            </div>
        </AppModal>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'blank'
})


import { useToast } from '@/components/ui/toast/use-toast'
const route = useRoute()

const { data, status, error, refresh } = await useFetch('/api/question/' + route.params.id, {
    key: 'questions'
})


const timer = ref(null)
const end_time = ref(null)
const submittedModal = ref(false)
const submissionState = ref('idle') // 'idle', 'submitting', 'success', 'error'

const { toast } = useToast()

const submitAns = async () => {
    try {
        submissionState.value = 'submitting'
        const answers = data.value.questions.filter(q => q.selected).map(q => q.selected)
        await $fetch('/api/question/' + route.params.id, {
            method: 'POST',
            body: { answers, submission_id: data.value.submission.id }
        })

        // Clear timer after successful submission
        clearTimeout(timer.value)
        timer.value = null

        // Show success state
        submissionState.value = 'success'
        submittedModal.value = true



        // Navigate after delay only on success
        setTimeout(() => {
            navigateTo('/')
        }, 2000)

    } catch (error) {
        submissionState.value = 'error'
        submittedModal.value = true

        toast({
            title: 'Submission Failed',
            description: 'Failed to submit your answers. Please try again.',
            variant: 'destructive'
        })
    }
}

const selectOption = (idx, a_id) => {
    data.value.questions[idx].selected = a_id
}

const progress = computed(() => {

    if (status.value !== 'success') return 0
    return data.value.questions.filter(q => q.selected).length / data.value.questions.length * 100
})



onMounted(() => {
    end_time.value = new Date(data.value.submission.created_at).getTime() + (data.value.exam.duration * 60 * 1000)
    console.log(end_time.value)
    // Clear any existing timer
    if (timer.value) {
        clearInterval(timer.value)
    }

    // Set up new timer
    timer.value = setInterval(() => {
        const now = new Date().getTime()
        const distance = end_time.value - now
        if (distance < 0) {
            clearInterval(timer.value)
            timer.value = null
            submitAns()
        }
    }, 1000)
})

// Cleanup timer when component unmounts
onUnmounted(() => {
    if (timer.value) {
        clearInterval(timer.value)
        timer.value = null
    }
})



</script>

<style lang="scss" scoped>
* {
    -webkit-user-select: none;
    /* Safari */
    -ms-user-select: none;
    /* IE 10 and IE 11 */
    user-select: none;
    /* Standard syntax */
}
</style>