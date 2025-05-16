<template>
  <div>
    <div
      class="fixed inset-0 -z-10 h-full  w-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
    </div>
    <Navbar />
    <div class="pt-24 pb-20 ">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style></style>