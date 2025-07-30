<template>
    <div class="space-y-3">



        <div class="flex gap-2 print:hidden">
            <Input type="text" v-model="url" placeholder="Enter the URL of the questions" />
            <AppButton @click="fetchQuestions" :loading="loading" label="Load Questions" />
            <Button @click="printQuestions" variant="destructive">
                <Icon name="lucide:printer" class="mr-2" />
                Print
            </Button>
        </div>

        <div class="space-y-4">
            <div class="flex justify-between">
                <h1>Questions
                    <span class="text-sm text-gray-500">({{ questions.length }})</span>
                </h1>

            </div>

            <div v-if="questions.length > 0" class="space-y-3">
                <div v-for="q, i in questions" :key="i" class="px-3 py-2 bg-white rounded-md">
                    <div class="text-lg font-semibold " v-html="q.question"></div>
                    <div>
                        <Badge variant="secondary" class="text-white bg-green-500">
                            Q. No. {{ i + 1 }}
                        </Badge>
                    </div>
                    <div class="grid gap-3 mt-4">
                        <div v-for="(a, k) in ['a', 'b', 'c', 'd']" :key="k">
                            <div class="flex gap-3 p-2 border rounded-lg">
                                <Badge variant="secondary" :class="{ 'bg-green-500 text-white': q[a] == q.correct }">
                                    {{ k + 1 }}
                                </Badge>
                                <AppMath v-model="q[a]"></AppMath>

                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </div>

    </div>
</template>

<script setup>

definePageMeta({
    layout: 'admin'
})


const url = ref('')
const questions = ref([])
const loading = ref(false)

const fetchQuestions = async () => {

    if (!url.value) {
        return
    }

    loading.value = true

    try {
        const sheetId = url.value.split('/')[5]

        const baseURL = `https://script.google.com/macros/s/AKfycbwzA-t_cUmiQpA7ArN8OEl_LBeu-JM9VgjrX3x0Camq-lsSt2Gd0xPZ3flPFyBipAQkJw/exec?type=question&sheet=${sheetId}`
        const res = await fetch(baseURL)
        const data = await res.json()
        questions.value = data
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}


const printQuestions = () => {
    window.print()
}


</script>

<style lang="scss" scoped></style>