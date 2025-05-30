<template>
    <div>

        <div class="flex justify-between print:hidden">
            <h1 class="text-2xl font-semibold">Questions</h1>

            <div class="flex items-center gap-3">
                <ExamImport :examId="route.params.id" />
                <Button @click="onOpen">
                    <Icon name="bx:bx-plus" />
                    Add Question
                </Button>
            </div>
        </div>

        <div v-if="status === 'success' && data.body.exam.data" class="print:hidden my-5">
            <div class="grid grid-cols-3 gap-4 p-4 mb-5 bg-white border rounded-lg">
                <div v-for="(count, difficulty) in data.body.exam.data" :key="difficulty" class="p-4 border rounded-lg">
                    <h3 class="mb-2 text-lg font-semibold capitalize">{{ difficulty }}</h3>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Required</p>
                            <p class="text-xl font-bold">{{ count }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Added</p>
                            <p class="text-xl font-bold">{{data.body.questions.filter(q => q.difficulty.toLowerCase()
                                === difficulty).length}}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Extra</p>
                            <p class="text-xl font-bold" :class="{
                                'text-red-500': count - data.body.questions.filter(q => q.difficulty.toLowerCase() === difficulty).length > 0,
                                'text-green-500': count - data.body.questions.filter(q => q.difficulty.toLowerCase() === difficulty).length <= 0
                            }">
                                {{data.body.questions.filter(q => q.difficulty.toLowerCase() ===
                                    difficulty).length - count}}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="status === 'success'" class="mt-5 space-y-5">

            <div v-for="(q, j) in data.body.questions" :key="q._id" class="p-5 bg-white border rounded-2xl">

                <div class="flex items-center justify-between">
                    <div class="inline-block space-x-3">
                        <Badge color="amber">
                            Q. {{ j + 1 }}
                        </Badge>
                        <Badge color="blue">
                            {{ q.subject }}
                        </Badge>
                        <Badge color="orange">
                            {{ q.difficulty }}
                        </Badge>
                    </div>
                    <div class="flex items-center gap-3 mt-3 print:hidden">
                        <Button @click="onEdit(q)" variant="outline">
                            <Icon name="bx:bx-edit" class="mr-2" />
                            Edit
                        </Button>
                        <Button @click="deleteMCQ(q.id)" variant="destructive">
                            <Icon name="lucide:trash" class="mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>

                <AppMath class="mt-3 text-lg font-semibold" v-model="q.question"></AppMath>


                <div class="flex flex-wrap gap-3 mt-4">
                    <div v-for="(a, k) in q.options" :key="k">
                        <div class="p-2 border rounded-lg"
                            :class="{ 'border-2 border-black': a.correct, 'bg-white': !a.correct }">

                            <AppMath v-model="a.option_text"></AppMath>

                        </div>

                    </div>
                </div>

                <div v-if="q.explain">

                    <div class="mt-3 text-lg font-semibold">Explanation</div>

                    <AppMath v-model="q.explain"></AppMath>


                </div>


            </div>
        </div>
        <div v-else>
            <AppLoader />
        </div>

    </div>

    <ExamQuestionModal />

</template>

<script setup>
import katex from 'katex'
import { useToast } from '@/components/ui/toast/use-toast'
definePageMeta({
    title: 'Questions',
    layout: 'admin'
})

const route = useRoute()

const { data, status, error, refresh } = await useLazyFetch('/api/admin/exam/' + route.params.id, {
    key: 'exam-questions'
})


const { onOpen, onEdit } = useQuestion()


const { toast } = useToast()

const deleteMCQ = async (id) => {
    const res = await $fetch('/api/admin/questions/' + id, {
        method: 'DELETE'
    })

    toast({
        title: "Question deleted successfully"
    })
    refresh()

}


onMounted(() => {
    window.katex = katex
})

</script>

<style lang="scss" scoped></style>