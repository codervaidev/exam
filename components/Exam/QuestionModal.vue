<template>


    <AppModal size="sm:min-w-3xl" :isOpen="isOpen" title="Question Management"
        description="Create and update question for an exam" @onClose="onClose" v-if="isOpen">

        <form @submit.prevent="onSubmit">
            <div class="space-y-6">
                <div class="grid grid-cols-2 gap-6 my-3">
                    <Select v-model="model.subject">
                        <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select Subject</SelectLabel>
                                <SelectItem v-for="s in SUBJECTS" :key="s" :value="s">
                                    {{ s }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select v-model="model.difficulty">
                        <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select difficulty</SelectLabel>
                                <SelectItem v-for="s in DIFFICULTY_LEVELS" :key="s" :value="s">
                                    {{ s }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div class="flex flex-wrap mb-6 -mx-3">
                <div class="w-full px-3 mb-6 md:mb-0">
                    <div class="flex items-center justify-between">
                        <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                            for="grid-question">Question</label>
                        <div class="inline-flex items-center space-x-2">
                            <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                                for="grid-question">Rich Text</label>
                            <input type="checkbox" class="-mt-2 checkbox checkbox-primary" v-model="richText.question">
                        </div>

                    </div>
                    <Textarea v-if="!richText.question" v-model="model.question" placeholder="Question">
                        </Textarea>
                    <div v-else>
                        <QuillEditor v-model:content="model.question" contentType="html" :options="editorOptions" />
                    </div>
                </div>
            </div>

            <Tabs default-value="easy">
                <TabsList class="grid w-full grid-cols-2">
                    <TabsTrigger value="easy">
                        Option Based
                    </TabsTrigger>
                    <TabsTrigger value="text">
                        Text Based
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="easy">

                    <div class="grid gap-6 my-6">
                        <div v-for="labels, key in optionLabels" :key="key" class="grid grid-cols-4 gap-4">
                            <Button v-for="l, j in labels" :key="j" @click.prevent="setOptions(key, l)"
                                :variant="model.options[j].correct && model.options[j].option_text === l ? '' : 'outline'">
                                {{ l }}
                            </Button>
                        </div>
                    </div>


                </TabsContent>
                <TabsContent value="text">
                    <div class="space-y-3">
                        <template v-for="(s, i) in ['a', 'b', 'c', 'd']" :key="i">

                            <div class="w-full p-1 space-y-2">
                                <div class="flex items-center justify-between">

                                    <div class="flex gap-2">
                                        <Checkbox @update:checked="model.options[i].correct = !model.options[i].correct"
                                            :checked="model.options[i].correct" />
                                        <label
                                            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                                            for="grid-question">Option {{ s.toUpperCase() }}</label>
                                    </div>

                                    <div class="flex gap-2">
                                        <Checkbox @update:checked="richText[s] = !richText[s]" />
                                        <label
                                            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                                            for="grid-question">Rich Text</label>
                                    </div>

                                </div>
                                <Input v-if="!richText[s]" v-model="model.options[i].option_text"
                                    placeholder="Answer" />
                                <div v-else>
                                    <QuillEditor v-model:content="model.options[i].option_text" contentType="html"
                                        :options="editorOptions" />
                                </div>
                            </div>
                        </template>
                    </div>
                </TabsContent>
            </Tabs>


            <div>
                <Label>
                    Explanation
                </Label>
                <QuillEditor v-model:content="model.explain" contentType="html" :options="editorOptions" />
            </div>



            <div class="py-2 my-3 text-center">
                <AppButton :loading="loading" type="submit" label="Save MCQ" :loadingLabel="'Please wait...'" />
            </div>
        </form>

    </AppModal>

</template>

<script setup>

import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useToast } from '@/components/ui/toast/use-toast'
import { SUBJECTS, DIFFICULTY_LEVELS } from '~/constants/academic'

const props = defineProps({

    label: {
        type: String,
        default: 'Create MCQ'
    },
    isEdit: {
        type: Boolean,
        default: false
    }
})

if (!import.meta.server) {
    const { QuillEditor } = await import('@vueup/vue-quill');
    const { vueApp } = useNuxtApp();
    vueApp.component('QuillEditor', QuillEditor);
}

const { onClose, isOpen, initialQuestion } = useQuestion()


const optionLabels = {
    'en': ['A', 'B', 'C', 'D'],
    'bn': ['ক', 'খ', 'গ', 'ঘ'],
    'mul': ['i, ii', 'ii, iii', 'i, iii', 'i, ii, iii']
}



const model = ref(
    initialQuestion.value ? {
        question: initialQuestion.value.question,
        options: initialQuestion.value.options.map(o => ({ option_text: o.option_text, correct: o.correct })),
        subject: initialQuestion.value.subject,
        difficulty: initialQuestion.value.difficulty,
        explain: initialQuestion.value.explain
    } : {
        question: '',
        options: [
            { option_text: '', correct: false },
            { option_text: '', correct: false },
            { option_text: '', correct: false },
            { option_text: '', correct: false }
        ],
        subject: '',
        difficulty: '',
        explain: ''

    })
const richText = ref({
    question: true,
    a: true,
    b: true,
    c: true,
    d: true,
    subject: '',
    difficulty: '',
    explain: ''
})



const emits = defineEmits(['close'])
const loading = ref(false)

const { toast } = useToast()
const route = useRoute()
const onSubmit = async () => {
    loading.value = true

    if (model.value.options.filter(o => o.correct).length == 0) {
        toast({
            title: "Please select correct answer"
        })
        loading.value = false
        return
    }

    if (!model.value.options.some(o => o.option_text)) {
        toast({
            title: "Please fill all the options"
        })
        loading.value = false
        return
    }

    if (model.value.question.trim() == '') {
        toast({
            title: "Please fill the question"
        })
        loading.value = false
        return
    }



    try {

        if (initialQuestion.value) {
            const data = await $fetch('/api/admin/questions/' + initialQuestion.value.id, {
                method: 'PUT',
                body: {
                    examId: route.params.id,
                    ...model.value,
                    options: model.value.options.map(o => ({ ...o, option_text: o.option_text, correct: o.correct, type: 'update' }))
                }
            })

            toast({
                title: "Question updated successfully"
            })

            refreshNuxtData('exam-questions')

            model.value = {
                question: '',
                options: [
                    { option_text: '', correct: false },
                    { option_text: '', correct: false },
                    { option_text: '', correct: false },
                    { option_text: '', correct: false }
                ],
                subject: '',
                difficulty: '',
                explain: ''
            }

            return onClose()
        }


        const data = await $fetch('/api/admin/questions', {
            method: 'POST',
            body: {
                examId: route.params.id,
                ...model.value
            }
        })

        if (data.statusCode === 201) {
            model.value = {
                question: '',
                options: [
                    { option_text: '', correct: false },
                    { option_text: '', correct: false },
                    { option_text: '', correct: false },
                    { option_text: '', correct: false }
                ],
                subject: '',
                difficulty: '',
                explain: ''
            }
            toast({
                title: "Question created successfully"
            })

            refreshNuxtData('exam-questions')

            return onClose()
        }
        loading.value = false
    } catch (error) {
        console.log(error)
        toast({
            title: "Something went wrong",
            description: error.response.data.message
        })

    } finally {
        loading.value = false

    }
}


watch(() => initialQuestion.value, (value) => {
    if (value) {
        model.value = {
            question: value.question,
            options: value.options.map(o => ({ ...o, option_text: o.option_text, correct: o.correct })),
            subject: value.subject,
            difficulty: value.difficulty,
            explain: value.explain
        }
    }
})


const setOptions = (lang, val) => {

    model.value.options = model.value.options.map((o, i) => {

        let option_text = optionLabels[lang][i] ?? null
        let correct = val == option_text

        return {
            ...o,
            option_text, correct,
            type: option_text ? 'update' : 'delete'
        }
    })



}









</script>

<style lang="scss" scoped></style>