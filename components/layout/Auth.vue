<script setup lang="ts">
defineProps<{
  reverse?: boolean
}>()
</script>

<template>
  <div class="relative flex items-center justify-center md:px-4 h-dvh lg:max-w-none lg:px-0"
    :class="{ 'flex-row-reverse': reverse }">
    <div class="relative flex-col flex-1 hidden h-full bg-muted lg:flex dark:border-r">
      <div class="absolute inset-0 bg-zinc-900" />

      <div class="relative z-20 flex flex-col items-center justify-center h-full gap-6 mt-auto ">

        <h3 class="text-3xl font-bold text-white">
          Rhombus <span class="text-red-400">Parallel</span>
        </h3>
        <AppTypewrite />
      </div>
    </div>
    <div class="flex-1 px-4 mx-auto overflow-y-scroll h-dvh hide-scrollbar lg:p-8">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
