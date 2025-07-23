<template>
    <div class="p-4 bg-white border rounded-xl ">
        <div class="grid grid-cols-2 sm:grid-cols-3  gap-3">
            <!-- Total Marks -->
            <div class="col-span-2 sm:col-span-1 p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <div class="flex items-center  gap-3">
                    <Icon name="lucide:target" class="w-5 h-5 text-gray-600" />
                    <div class="text-left flex sm:flex-col justify-between w-full items-center sm:items-start">
                        <div class="sm:text-xs text-sm font-medium text-gray-600">Obtained Marks</div>
                        <div class="text-xl font-bold text-gray-900">{{ obtained_marks }}/{{
                            total_marks }}</div>
                    </div>
                </div>
            </div>

            <!-- Correct -->
            <div class="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div class="flex items-center gap-3">
                    <Icon name="lucide:check-circle" class="w-5 h-5 text-green-600" />
                    <div class="text-left">
                        <div class="text-sm font-medium text-green-600">Correct</div>
                        <div class="text-xl font-bold text-green-700">{{ correct }}</div>
                    </div>
                </div>
            </div>

            <!-- Incorrect -->
            <div class="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                <div class="flex items-center gap-3">
                    <Icon name="lucide:x-circle" class="w-5 h-5 text-red-600" />
                    <div class="text-left">
                        <div class="text-sm font-medium text-red-600">Incorrect</div>
                        <div class="text-xl font-bold text-red-700">{{ incorrect }}</div>
                    </div>
                </div>
            </div>



        </div>
    </div>
</template>

<script setup>


const props = defineProps({
    total_marks: {
        type: Number,
        required: true
    },
    obtained_marks: {
        type: Number,
        required: true
    },
    correct: {
        type: Number,
        required: true
    },
    incorrect: {
        type: Number,
        required: true
    },
    total_not_answered: {
        type: Number,
        required: true
    },
    extra_questions: {
        type: Number,
        required: true
    }
})


</script>

<style lang="scss" scoped></style>