<template>
    <section
        class="relative hidden md:flex items-center justify-center bg-gradient-to-br from-black via-[#1a140a] to-[#2d220e] overflow-hidden ">


        <div
            class="relative z-10 w-full max-w-7xl px-4 md:px-8 py-10 md:py-16 flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-16">
            <!-- Left: Hero Text -->
            <div class="flex-1 flex flex-col items-start">
                <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-5 md:mb-6 leading-tight drop-shadow-lg">
                    SSC26 33Days Challenge
                </h1>
                <div class="flex items-center mb-5 md:mb-6">
                    <span
                        class="inline-flex gap-2 items-center bg-[#0086434D]/30 text-white text-base border border-[#00864333] rounded-lg px-4 py-2 shadow-sm">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M10.0002 0.833496C10.234 0.833496 10.4366 0.995527 10.4879 1.22362L10.8471 2.818C11.1093 3.98202 12.0183 4.89102 13.1823 5.15323L14.7767 5.51239C15.0048 5.56377 15.1668 5.76636 15.1668 6.00016C15.1668 6.23397 15.0048 6.43656 14.7767 6.48794L13.1823 6.84709C12.0183 7.1093 11.1093 8.01831 10.8471 9.18232L10.4879 10.7767C10.4366 11.0048 10.234 11.1668 10.0002 11.1668C9.76636 11.1668 9.56377 11.0048 9.51239 10.7767L9.15323 9.18232C8.89102 8.01831 7.98202 7.1093 6.818 6.84709L5.22362 6.48794C4.99553 6.43656 4.8335 6.23397 4.8335 6.00016C4.8335 5.76636 4.99553 5.56377 5.22362 5.51239L6.818 5.15323C7.98202 4.89102 8.89102 3.98202 9.15323 2.818L9.51239 1.22362C9.56377 0.995527 9.76636 0.833496 10.0002 0.833496Z"
                                fill="#008643" />
                            <path
                                d="M4.66683 7.5C4.90064 7.5 5.10323 7.66203 5.15461 7.89012L5.41115 9.02897C5.58631 9.80659 6.19357 10.4138 6.97119 10.589L8.11004 10.8456C8.33813 10.8969 8.50016 11.0995 8.50016 11.3333C8.50016 11.5671 8.33813 11.7697 8.11004 11.8211L6.97119 12.0776C6.19357 12.2528 5.58631 12.8601 5.41115 13.6377L5.15461 14.7765C5.10323 15.0046 4.90064 15.1667 4.66683 15.1667C4.43302 15.1667 4.23043 15.0046 4.17905 14.7765L3.92251 13.6377C3.74735 12.8601 3.14008 12.2528 2.36246 12.0776L1.22362 11.8211C0.995527 11.7697 0.833496 11.5671 0.833496 11.3333C0.833496 11.0995 0.995527 10.8969 1.22362 10.8456L2.36246 10.589C3.14008 10.4138 3.74735 9.80659 3.92251 9.02897L4.17905 7.89012C4.23043 7.66203 4.43302 7.5 4.66683 7.5Z"
                                fill="#008643" />
                        </svg>
                        <span v-if="status === 'success'">
                            {{ Intl.NumberFormat('bn-BD').format(data.body.totalUsers) }} জন শিক্ষার্থী পরীক্ষা দিয়ে
                            ফেলেছে ইতিমধ্যে
                        </span>
                    </span>
                </div>
                <p class="text-base  text-white/90 leading-relaxed drop-shadow-sm max-w-2xl">
                    কেমন হতো যদি ফ্রি-তেই পুরো SSC পরীক্ষার সিলেবাস কমপ্লিট হয়ে যেতো আবার পরীক্ষার মাধ্যমে প্র্যাক্টিস
                    করে সিলেবাসের উপর দক্ষতা যাচাই করে ১ লক্ষ টাকাও জেতা যেতো? <br> <br> শিক্ষার্থীদের জন্য তেমন ভাবনা
                    থেকেই
                    ACS
                    Future School এর SSC 33days challenge ক্যাম্পেইন। ৩৩ দিনে SSC শর্ট সিলেবাসের ৩৩ চ্যাপ্টারের ক্লাস
                    এবং ৩৩টি পরীক্ষার মাধ্যমে তাই সাজানো আমাদের এই ক্যাম্পেইন। ৩৩টি অনলাইন এবং ১টি অফলাইন এক্সামের
                    মাধ্যমে সেরাদের সেরা টপ ৩জন এর জন্য থাকবে ১ লক্ষ টাকা জিতে নেয়ার সুযোগ! তুমিও বিজয়ী হতে পারো এই
                    ক্যাম্পেইনে। তাহলে, আর দেরি কেনো এখনই অংশগ্রহন করো SSC26 33Days Challenge ক্যাম্পেইনে।
                </p>
            </div>
            <!-- Right: Exam Start Card -->
            <div class="w-full max-w-md  overflow-hidden rounded-2xl  flex flex-col items-center">
                <div class="w-full aspect-video rounded-lg overflow-hidden">
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/DBX9nJ45RUg"
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen class="w-full h-full"></iframe>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const { data, status } = await useFetch('/api/exams/next');

// Reactive variables for countdown display
const days = ref('00');
const hours = ref('00');
const minutes = ref('00');
const seconds = ref('00');

let countdownInterval = null;

// Function to calculate and update countdown
const updateCountdown = () => {
    if (!data.value?.nextExam) {
        days.value = '00';
        hours.value = '00';
        minutes.value = '00';
        seconds.value = '00';
        return;
    }

    const now = new Date().getTime();
    const examTime = new Date(data.value.nextExam).getTime();
    const timeLeft = examTime - now;

    // If exam time has passed, show zeros
    if (timeLeft <= 0) {
        days.value = '00';
        hours.value = '00';
        minutes.value = '00';
        seconds.value = '00';
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        return;
    }

    // Calculate days, hours, minutes, seconds
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Format with leading zeros
    days.value = daysLeft.toString().padStart(2, '0');
    hours.value = hoursLeft.toString().padStart(2, '0');
    minutes.value = minutesLeft.toString().padStart(2, '0');
    seconds.value = secondsLeft.toString().padStart(2, '0');
};

// Start countdown when component mounts
onMounted(() => {
    updateCountdown(); // Initial update
    countdownInterval = setInterval(updateCountdown, 1000); // Update every second
});

// Cleanup interval when component unmounts
onUnmounted(() => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});
</script>

<style lang="scss" scoped>
/* Optional: Add custom styles if needed */
</style>