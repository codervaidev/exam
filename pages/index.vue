<template>
  <AppContainer>

    <div v-if="status === 'success'" class="space-y-6">
      <div class="max-w-2xl mx-auto">
        <ExamCard v-for="exam in data.body.ongoingExams" :key="exam.id" :exam="exam" />
      </div>
    
          <div v-if="data.body.upcomingExams.length > 0" class="grid gap-6 md:grid-cols-2">
            <ExamCard v-for="exam in data.body.upcomingExams" :key="exam.id" :exam="exam" />
          </div>

          <AppEmptyState v-else title="No exam scheduled" />


    </div>
    <div v-else class="py-8">
      <AppLoader />
    </div>
  </AppContainer>
</template>

<script setup>

definePageMeta({
  middleware: ['protected']
})



const { data, status, error, refresh } = await useLazyFetch('/api/exams', {
  key: 'admin-exams',
})




</script>

<style lang="scss" scoped></style>