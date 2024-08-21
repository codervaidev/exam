<template>
  <AppContainer>

    <div v-if="status === 'success'" class="space-y-6">
      <div class="max-w-2xl mx-auto">
        <ExamCard v-for="exam in data.body.ongoingExams" :key="exam.id" :exam="exam" />
      </div>
      <Tabs default-value="upcoming">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming Exams
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Exams
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div v-if="data.body.upcomingExams.length > 0" class="grid gap-6 md:grid-cols-2">
            <ExamCard v-for="exam in data.body.upcomingExams" :key="exam.id" :exam="exam" />
          </div>

          <AppEmptyState v-else title="No exam scheduled" />


        </TabsContent>
        <TabsContent value="past">
          <div v-if="data.body.pastExams.length > 0" class="grid gap-6 md:grid-cols-2">
            <ExamCard v-for="exam in data.body.pastExams" :key="exam.id" :exam="exam" />
          </div>
          <AppEmptyState title="No exam found" v-else />

        </TabsContent>
      </Tabs>


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