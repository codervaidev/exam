<template>
    <Dialog :open="isOpen" @update:open="closeModal">
        <DialogContent class="max-w-xl max-h-[90vh] overflow-y-auto hide-scrollbar">


            <div class="space-y-6">
                <!-- Top Banner Image -->
                <div class=" flex items-center justify-center text-center text-white h-72 rounded-lg overflow-hidden ">
                    <img :src="exam?.data?.poster" alt="" class="w-full h-full object-cover aspect-square">
                </div>

                <!-- Course/Exam Header -->
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-xl font-bold ">{{ exam?.title }}</h2>
                        <p>{{ exam?.subject }}</p>
                    </div>
                    <span class="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                        চলমান পরীক্ষা
                    </span>
                </div>



                <!-- Exam Instructions -->
                <div class="space-y-4">
                    <h3 class="text-lg font-bold text-gray-900">পরীক্ষার নির্দেশনাবলি</h3>
                    <div class="bg-gray-50 p-4 rounded-lg space-y-3">
                        <ul class="space-y-3 list-none">
                            <li class="flex items-start gap-3">
                                <span class="mt-1 w-3 h-3 rounded-full bg-green-600 flex-shrink-0"></span>
                                <span class="text-gray-700 text-sm">
                                    প্রতিটি MCQ প্রশ্নের জন্য চারটি করে অপশন থাকবে। সঠিক উত্তরটি বাছাই করতে হবে। একই
                                    প্রশ্নের একাধিক উত্তর থাকবে না। কোনো প্রশ্নের সঠিক উত্তর না থাকলে সবচেয়ে কাছাকাছি
                                    উত্তরটি বাছাই করতে হবে।
                                </span>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="mt-1 w-3 h-3 rounded-full bg-green-600 flex-shrink-0"></span>
                                <span class="text-gray-700 text-sm">
                                    প্রতিটি সঠিক উত্তরের জন্য ১ নম্বর পাওয়া যাবে।
                                </span>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="mt-1 w-3 h-3 rounded-full bg-green-600 flex-shrink-0"></span>
                                <span class="text-gray-700 text-sm">
                                    প্রতিটি ভুল উত্তরের জন্য ২৫% নম্বর কাটা যাবে। [কনডিশনাল অন ডিমান্ড]
                                </span>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="mt-1 w-3 h-3 rounded-full bg-green-600 flex-shrink-0"></span>
                                <span class="text-gray-700 text-sm">
                                    সময় শেষ হয়ে গেলে অটো সাবমিট হয়ে যাবে।
                                </span>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="mt-1 w-3 h-3 rounded-full bg-green-600 flex-shrink-0"></span>
                                <span class="text-gray-700 text-sm">
                                    ইন্টার্নেট জনিত সমস্যা অথবা অন্য কোন কারণে যদি, এক্সাম থেকে বের হয়ে যাও, তাহলে
                                    নির্ডিষ্ট টাইম শেষে অটো সাবমিট হয়ে যাবে।
                                </span>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="mt-1 w-3 h-3 rounded-full bg-green-600 flex-shrink-0"></span>
                                <span class="text-gray-700 text-sm">
                                    নির্দিষ্ট সময়ের ভেতর দেয়া শুধুমাত্র প্রথবারের কুইজটির মার্ক্সই লিডারবোর্ডে আসবে।
                                </span>
                            </li>
                            <li class="flex items-start gap-3">
                                <span class="mt-1 w-3 h-3 rounded-full bg-green-600 flex-shrink-0"></span>
                                <span class="text-gray-700 text-sm">
                                    টাইম শেষেও প্র্যাকটিস এক্সাম দেয়া যাবে, তবে সেগুলোর মার্ক্স লিডারবোর্ডে আসবেনা।
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Suitable Class Section -->
                <div v-if="exam?.yt_class_link" class="w-full bg-gray-50 rounded-xl p-5 flex items-center gap-5 mt-6">
                    <div class="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-red-100">
                        <Icon name="lucide:play-circle" class="w-8 h-8 text-red-600" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                            <h2 class="text-base sm:text-lg font-bold text-gray-900">
                                {{ exam.chapter }}
                            </h2>
                            <h3 class="text-base sm:text-lg font-semibold text-gray-700 mt-1 sm:mt-0">
                                {{ exam.data.teacher }}
                            </h3>
                        </div>
                        <div class="mt-3">
                            <a :href="exam.yt_class_link" target="_blank" rel="noopener"
                                class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                                <Icon name="lucide:play-circle" class="w-5 h-5 mr-2" />
                                ক্লাসটি দেখে নাও
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter class="flex gap-3">

                <button v-if="!exam?.isLocked" @click="startExam"
                    class="flex items-center justify-center gap-2 w-full h-12 font-semibold special_effect bg-primary text-white rounded-xl">

                    পরীক্ষা শুরু করো
                </button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
const props = defineProps({
    exam: {
        type: Object,
        required: true
    },
    isOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close', 'start-exam'])

const closeModal = () => {
    emit('close')
}

const startExam = () => {
    if (!props.exam?.isLocked) {
        emit('start-exam', props.exam)
    }
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('bn-BD', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>

<style lang="scss" scoped></style>