<template>
    <div class="bottom-0 left-0 right-0 flex items-center justify-center p-4 ">
        <button class="flex items-center px-4 py-2 space-x-2 text-lg font-semibold rounded-lg">
            <span>{{ formatTime(hour) }}</span>
            <span>:</span>
            <span>{{ formatTime(minute) }}</span>
            <span>:</span>
            <span>{{ formatTime(second) }}</span>
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    endTime: {
        type: Date,
        required: true
    }
})

const hour = ref(0)
const minute = ref(0)
const second = ref(0)

const startTimer = () => {
    let end_time = new Date(props.endTime).getTime()
    let timer = setInterval(() => {
        let now = new Date().getTime()
        let distance = end_time - now
        hour.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        minute.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        second.value = Math.floor((distance % (1000 * 60)) / 1000)

        if (distance < 0) {
            clearInterval(timer)
        }
    }, 1000)
}

onMounted(() => {
    startTimer()
})

const formatTime = (time) => {
    return time < 10 ? `0${time}` : time
}
</script>

<style scoped></style>
