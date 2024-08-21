<template>
  <AppContainer>

    <div v-if="status === 'success'" class="grid gap-6 md:grid-cols-2">



      <ExamCard v-for="exam in data.body" :key="exam.id" :exam="exam" />
    </div>
    <div v-else class="py-8">
      <AppLoader />
    </div>
  </AppContainer>
</template>

<script setup>

const { onOpen } = useExam()

const { data, status, error, refresh } = await useFetch('/api/exams', {
  key: 'admin-exams',
})


</script>

<style lang="scss" scoped></style>