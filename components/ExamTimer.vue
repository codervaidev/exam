<template>
    <div class="text-sm">
        {{ formatTime(hour) }}
        <span class="text-xs font-thin">h</span>
        {{ formatTime(minute) }}
        <span class="text-xs font-thin">m</span>
        {{ formatTime(second) }}
        <span class="text-xs font-thin">s</span>
    </div>
</template>

<script setup>


const props = defineProps({
    end_time: {
        type: Number,
        required: true,
    },
});

const hour = ref(0);
const minute = ref(0);
const second = ref(0);

const startTimer = () => {
    // timer will be stopped at end_time
    const end_time = new Date(props.end_time).getTime();
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = end_time - now;
        hour.value = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        minute.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        second.value = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
            clearInterval(timer);
        }
    }, 1000);
};

onMounted(() => {
    startTimer();
});

const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
};
</script>
