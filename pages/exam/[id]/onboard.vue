<template>
    <div v-if="status === 'success'" class="container p-4 mx-auto">
        <div
            class="max-w-2xl p-8 mx-auto my-10 transition-all duration-300 border shadow-lg rounded-xl hover:shadow-xl">
            <div class="space-y-8 text-center">
                <div class="flex items-center justify-center px-6 py-4 space-x-3 text-white rounded-lg bg-rose-500">
                    <Icon name="lucide:alert-circle" size="24" />
                    <p class="text-sm font-medium">
                        একবার এক্সাম দিতে ঢুকলেই তোমার সময় শুরু হয়ে যাবে। ভুলে বা নেটের সমস্যায় বা
                        অন্য যেকোনো কারণে একাধিকবার এক্সাম দেয়ার চেষ্টা করলে র‍্যাংকিং এ তোমার নাম
                        সবার নিচে চলে যাবে।
                    </p>
                </div>

                <div class="space-y-4">
                    <h1 class="text-4xl font-bold ">
                        {{ data.exam.title }}
                    </h1>
                    <div class="flex items-center justify-center space-x-3 ">
                        <Icon name="lucide:calendar" class="w-6 h-6" />
                        <h2 class="text-xl font-semibold">
                            এক্সাম শুরু হবে:
                        </h2>
                    </div>
                    <p class="text-2xl font-medium ">
                        {{ formatDate(data.exam.startTime) }}
                    </p>
                </div>

                <div class="mt-8">
                    <Button @click="navigateTo('/exam/' + data.exam.id)"
                        class="px-10 py-4 text-lg font-semibold text-white transition-all duration-300 transform rounded-full shadow-md bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                        শুরু করুন
                    </Button>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center w-full h-screen">
        <AppLoader />
    </div>
</template>

<script setup>

definePageMeta({
    middleware: 'protected'
})

const route = useRoute()

const { data, status, error, refresh } = await useFetch('/api/exams/' + route.params.id, {

})


</script>

<style lang="scss" scoped></style>