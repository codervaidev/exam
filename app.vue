<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Toaster />

    <AuthUpdate :isOpen="isOpen" />
  </div>

</template>

<script lang="ts" setup>


const user = useUser();


const { isOpen } = useUpdate()

onMounted(() => {
  if (user.value && (!user.value.address || !user.value.tshirt)) {
    isOpen.value = true;
  }
})



</script>
