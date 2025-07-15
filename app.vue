<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <Toaster />
    <!-- <AuthRegister /> -->


  </div>

</template>

<script lang="ts" setup>


const user = useUser();





</script>
