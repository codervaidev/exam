<template>
    <div class="container">
        <h1 class="text-center title_grad">
            <span class="text-2xl font-semibold ">{{
                typeValue
            }}</span>
            <span class="blinking-cursor">|</span>
            <span class="cursor" :class="{ typing: typeStatus }">&nbsp;</span>
        </h1>
    </div>
</template>

<script lang="ts" setup>


const typeValue = ref('');
const typeStatus = ref(false);
const displayTextArray = ref([
    "Redefine Your Path, Reclaim Your Future.",
    "Stronger, Wiser, Ready to Rise.",
    "The Test Isn't Over Until You Win.",
    "Resilience is Your Superpower—Conquer It!",
    "Fuel Your Comeback with Determination.",
    "The Next Chapter Starts with You.",
    "Rewrite the Script, Ace the Test.",
    "Persistence Pays Off—This Time is Yours.",
]);
const typingSpeed = ref(100);
const erasingSpeed = ref(100);
const newTextDelay = ref(2000);
const displayTextArrayIndex = ref(0);
const charIndex = ref(0);

const typeText = () => {
    if (charIndex.value < displayTextArray.value[displayTextArrayIndex.value].length) {
        if (!typeStatus.value) typeStatus.value = true;
        typeValue.value += displayTextArray.value[displayTextArrayIndex.value].charAt(charIndex.value);
        charIndex.value += 1;
        setTimeout(typeText, typingSpeed.value);
    } else {
        typeStatus.value = false;
        setTimeout(eraseText, newTextDelay.value);
    }
};

const eraseText = () => {
    if (charIndex.value > 0) {
        if (!typeStatus.value) typeStatus.value = true;
        typeValue.value = displayTextArray.value[displayTextArrayIndex.value].substring(0, charIndex.value - 1);
        charIndex.value -= 1;
        setTimeout(eraseText, erasingSpeed.value);
    } else {
        typeStatus.value = false;
        displayTextArrayIndex.value += 1;
        if (displayTextArrayIndex.value >= displayTextArray.value.length)
            displayTextArrayIndex.value = 0;
        setTimeout(typeText, typingSpeed.value + 1000);
    }
};

onMounted(() => {
    setTimeout(typeText, newTextDelay.value + 200);
});


</script>

<style lang="css" scoped>
.blinking-cursor {
    font-size: 2rem;
    color: #1c1b33;
    -webkit-animation: 1s blink step-end infinite;
    -moz-animation: 1s blink step-end infinite;
    -ms-animation: 1s blink step-end infinite;
    -o-animation: 1s blink step-end infinite;
    animation: 1s blink step-end infinite;
}

@keyframes blink {

    from,
    to {
        color: transparent;
    }

    50% {
        color: #2c3e50;
    }
}

@-moz-keyframes blink {

    from,
    to {
        color: transparent;
    }

    50% {
        color: #2c3e50;
    }
}

@-webkit-keyframes blink {

    from,
    to {
        color: transparent;
    }

    50% {
        color: #2c3e50;
    }
}

@-ms-keyframes blink {

    from,
    to {
        color: transparent;
    }

    50% {
        color: #2c3e50;
    }
}

@-o-keyframes blink {

    from,
    to {
        color: transparent;
    }

    50% {
        color: #2c3e50;
    }
}
</style>
