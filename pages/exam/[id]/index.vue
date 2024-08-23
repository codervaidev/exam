<template>

    <header class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <AppContainer>
            <div class="container flex items-center justify-between px-2 py-4 mx-auto md:px-4">
                <h1 class="hidden text-xl font-bold text-gray-800 md:block">{{ data.exam.title }}</h1>
                <div class="flex items-center justify-between flex-1 space-x-4 md:justify-end">
                    <div v-if="end_time" class="flex gap-4 text-lg font-semibold text-slate-800">
                        <!-- Time Left: -->
                        <ExamTimer :end_time="end_time" />

                    </div>
                    <Button @click="submitAns"
                        class="px-3 py-3 font-semibold text-white transition-all duration-300 transform rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Submit Exam
                    </Button>
                </div>
            </div>
        </AppContainer>
        <Progress v-model="progress" class="w-full rounded-none " />
    </header>
    <div class="max-w-2xl py-5 mx-auto space-y-4 md:py-10 md:space-y-6" v-if="status === 'success'">
        <h1 class="text-xl font-bold text-center title_grad md:hidden">{{ data.exam.title }}</h1>
        <div v-for="(q, i) in data.questions" :key="i"
            class="p-3 mx-2 space-y-3 bg-white border rounded-lg shadow-md md:p-6">

            <div class="text-lg font-semibold text-gray-900 " v-html="q.question"></div>

            <div class="flex flex-wrap gap-3 ">
                <Badge> Q no. {{ i + 1 }}</Badge>
                <Badge> {{ q.subject }}</Badge>
                <Badge> 1 Marks</Badge>
            </div>
            <div class="mt-3 space-y-3 ">

                <div v-for="(a, j) in q.options" :key="j"
                    class="flex items-center p-3 space-x-2 transition-colors border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    :class="{ 'border-slate-500': data.questions[i].selected == a.id }" @click="selectOption(i, a.id)">


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


const timer = useLocalStorage('timer', null)

const { toast } = useToast()

const submitAns = async () => {

    try {
        const answers = data.value.questions.filter(q => q.selected).map(q => ({
            q: q.id,
            a: q.selected
        }))
        await $fetch('/api/question/' + route.params.id, { method: 'POST', body: { answers } })
        clearTimeout(timer.value)
        timer.value = null



        toast({
            title: 'Submitted',
            description: 'Your answers have been submitted successfully',

        })
    } catch (error) {
        toast({
            title: 'Error',
            variant: 'destructive'
        })
    }
    navigateTo('/')
}

const selectOption = (idx, a_id) => {
    data.value.questions[idx].selected = a_id
}

const progress = computed(() => {

    if (status.value !== 'success') return 0
    return data.value.questions.filter(q => q.selected).length / data.value.questions.length * 100
})



const end_time = ref(null)

onMounted(() => {

    end_time.value = new Date(data.value.submission.createdAt).getTime() + (data.value.exam.duration * 60 * 1000)

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



</script>

<style lang="scss" scoped></style>