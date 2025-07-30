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
                <div v-if="exam?.yt_class_link"
                    class="w-full border bg-gray-50 rounded-xl p-2 flex items-center gap-5 mt-6">
                    <div class="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full">
                        <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M3.66659 0C2.78253 0 1.93468 0.351189 1.30956 0.976311C0.684441 1.60143 0.333252 2.44928 0.333252 3.33333V26.6667C0.333252 27.5507 0.684441 28.3986 1.30956 29.0237C1.93468 29.6488 2.78253 30 3.66659 30H30.3333C31.2173 30 32.0652 29.6488 32.6903 29.0237C33.3154 28.3986 33.6666 27.5507 33.6666 26.6667V3.33333C33.6666 2.44928 33.3154 1.60143 32.6903 0.976311C32.0652 0.351189 31.2173 0 30.3333 0H3.66659ZM11.3749 9.38333C11.4119 9.0647 11.5229 8.75911 11.6989 8.49096C11.875 8.22282 12.1112 7.99953 12.3889 7.83892C12.6666 7.67831 12.978 7.58481 13.2982 7.5659C13.6184 7.54699 13.9386 7.60319 14.2333 7.73C15.0733 8.09 16.8466 8.9 19.0933 10.1967C20.6722 11.0991 22.197 12.093 23.6599 13.1733C23.9171 13.3647 24.126 13.6136 24.27 13.9001C24.4139 14.1866 24.4888 14.5027 24.4888 14.8233C24.4888 15.1439 24.4139 15.4601 24.27 15.7466C24.126 16.0331 23.9171 16.2819 23.6599 16.4733C22.1969 17.5525 20.6721 18.5454 19.0933 19.4467C17.5228 20.364 15.9 21.1887 14.2333 21.9167C13.9386 22.0438 13.6183 22.1003 13.298 22.0816C12.9777 22.0628 12.6661 21.9694 12.3884 21.8087C12.1106 21.6481 11.8743 21.4246 11.6983 21.1563C11.5223 20.8879 11.4116 20.5821 11.3749 20.2633C11.1749 18.457 11.077 16.6407 11.0816 14.8233C11.0816 12.2383 11.2683 10.2917 11.3749 9.38333Z"
                                fill="#008643" />
                        </svg>
                    </div>
                    <div class="flex-1 w-full flex justify-betweem">


                        <div class="flex-1">
                            <h2 class="text-base font-bold text-gray-900">
                                {{ exam.chapter }}
                            </h2>
                            <h3 class="text-sm  font-semibold text-gray-700 mt-1 sm:mt-0">
                                {{ exam.data.teacher }}
                            </h3>
                        </div>
                        <div class="px-3 flex items-center gap-2">
                            <a :href="exam.yt_class_link" target="_blank" rel="noopener"
                                class="inline-flex items-center  text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                        d="M9.13635 5.39662C9.13279 5.49727 9.14955 5.59761 9.18562 5.69165C9.22168 5.78569 9.27632 5.8715 9.34628 5.94397C9.41623 6.01643 9.50006 6.07406 9.59276 6.11342C9.68547 6.15279 9.78516 6.17307 9.88588 6.17307C9.9866 6.17307 10.0863 6.15279 10.179 6.11342C10.2717 6.07406 10.3555 6.01643 10.4255 5.94396C10.4954 5.8715 10.5501 5.78569 10.5861 5.69165C10.6222 5.59761 10.639 5.49727 10.6354 5.39662L10.6361 0.799714L10.6361 0.050181L9.88659 0.0501808L5.29039 0.050181C5.09376 0.0535046 4.90631 0.133924 4.7684 0.274118C4.63049 0.414313 4.55316 0.603065 4.55307 0.799721C4.55297 0.996376 4.63012 1.1852 4.7679 1.32553C4.90568 1.46585 5.09306 1.54645 5.28968 1.54995L8.07568 1.54995L0.736624 8.88902C0.595971 9.02967 0.516954 9.22043 0.516954 9.41935C0.516954 9.61826 0.595971 9.80902 0.736624 9.94968C0.877276 10.0903 1.06804 10.1693 1.26695 10.1693C1.46587 10.1693 1.65663 10.0903 1.79728 9.94968L9.13634 2.61061L9.13635 5.39662Z"
                                        fill="#008643" />
                                </svg>

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