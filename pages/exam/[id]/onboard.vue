<template>
    <div v-if="status === 'success'" class="container p-4 mx-auto">
        <div
            class="max-w-2xl p-6 mx-auto my-10 transition-all duration-300 border border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-xl">
            <div class="space-y-6 text-center">
                <div
                    class="flex items-center justify-center px-4 py-3 space-x-2 rounded-lg text-amber-600 bg-amber-100 animate-pulse">
                    <Icon name="lucide:info" size="30" />
                    <p class="text-sm font-medium">
                        একবার এক্সাম দিতে ঢুকলেই তোমার সময় শুরু হয়ে যাবে। ভুলে বা নেটের সমস্যায় বা
                        অন্য যেকোনো কারণে একাধিকবার এক্সাম দেয়ার চেষ্টা করলে র‍্যাংকিং এ তোমার নাম
                        সবার নিচে চলে যাবে।
                    </p>
                </div>

                <div class="space-y-3">
                    <h1 class="text-3xl font-bold text-indigo-800">
                        {{ data.exam.title }}
                    </h1>
                    <div class="flex items-center justify-center space-x-2 text-indigo-600">
                        <Icon name="lucide:clock" class="w-5 h-5" />
                        <h2 class="text-lg font-semibold">
                            এক্সাম শুরু হবে:
                        </h2>
                    </div>
                    <p class="text-xl font-medium text-indigo-700">
                        {{ formatDate(data.exam.startTime) }}
                    </p>
                </div>

                <div class="mt-6">
                    <Button @click="navigateTo('/exam/' + data.exam.id)"
                        class="px-8 py-3 text-lg font-semibold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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


const route = useRoute()

const { data, status, error, refresh } = await useFetch('/api/exams/' + route.params.id, {

})


</script>

<style lang="scss" scoped></style>