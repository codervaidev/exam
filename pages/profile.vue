<template>
    <div class="min-h-screen py-8">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Profile Header -->
            <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-2xl font-bold text-gray-800">Student Profile</h1>
                    <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                        <span class="text-3xl font-bold text-blue-600">{{ userInfo.name?.charAt(0) }}</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Full Name</label>
                            <p class="mt-1 text-lg font-semibold text-gray-800">{{ userInfo.name }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Phone Number</label>
                            <p class="mt-1 text-lg font-semibold text-gray-800">{{ userInfo.phone }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Institute</label>
                            <p class="mt-1 text-lg font-semibold text-gray-800">{{ userInfo.institute }}</p>
                        </div>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500">Address</label>
                            <p class="mt-1 text-lg font-semibold text-gray-800">{{ userInfo.address }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500">T-Shirt Size</label>
                            <p class="mt-1 text-lg font-semibold text-gray-800">{{ userInfo.tshirt }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Exam Results -->
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Exam Results</h2>

                <div class="space-y-6" v-if="marks && marks.length > 0">
                    <div v-for="(mark, index) in marks" :key="index"
                        class="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">{{ mark.exam.title }}</h3>
                                <p class="text-sm text-gray-500">Duration: {{ millisecToTime(mark.duration,
                                    mark.exam.duration) }} minutes</p>
                            </div>
                            <div class="text-right">
                                <div class="text-3xl font-bold"
                                    :class="mark.marks >= 0 ? 'text-green-600' : 'text-red-600'">
                                    {{ mark.marks }}
                                </div>
                                <div class="text-sm text-gray-500">Marks</div>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-4 mt-4">
                            <div class="bg-green-50 p-3 rounded-lg">
                                <div class="text-sm text-gray-500">Correct</div>
                                <div class="text-xl font-bold text-green-600">{{ mark.correct }}</div>
                            </div>
                            <div class="bg-red-50 p-3 rounded-lg">
                                <div class="text-sm text-gray-500">Incorrect</div>
                                <div class="text-xl font-bold text-red-600">{{ mark.incorrect }}</div>
                            </div>
                            <div class="bg-yellow-50 p-3 rounded-lg">
                                <div class="text-sm text-gray-500">Skipped</div>
                                <div class="text-xl font-bold text-yellow-600">{{ mark.skipped }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p class="text-gray-500">No exam results found</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { data: marks, status } = await useFetch("/api/auth/profile")
const user = useUser()

const userInfo = computed(() => ({
    name: user.value?.name,
    phone: user.value?.phone,
    role: user.value?.role,
    institute: user.value?.institute,
    address: user.value?.address,
    tshirt: user.value?.tshirt,
    id: user.value?.id,
}))

const millisecToTime = (duration: number | null, examDuration: number) => {
    if (!duration) return 0
    return Math.round(duration / 1000 / 60)
}
</script>