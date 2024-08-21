<template>


    <div class="max-w-2xl py-5 mx-auto space-y-3" v-if="status === 'success'">

        <div>

            <h2 class="text-2xl font-semibold text-center ">
                {{ data.exam.title }}
            </h2>

        </div>


        <div v-for="(q, i) in data.questions" :key="i" class="p-6 space-y-3 bg-white border rounded-lg shadow-md">

            <div class="text-lg font-semibold text-gray-900 " v-html="q.question"></div>

            <div class="flex flex-wrap gap-3 ">
                <Badge> Q no. {{ i + 1 }}</Badge>
                <Badge> {{ q.subject }}</Badge>
                <Badge> 1 Marks</Badge>
            </div>
            <div class="mt-3 space-y-3 ">

                <div v-for="(a, j) in q.options" :key="j"
                    class="flex items-center p-3 space-x-2 transition-colors border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    :class="{ 'border-slate-500': a.correct }">


                    <div v-katex="a.option_text">
                    </div>
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








</script>

<style lang="scss" scoped></style>