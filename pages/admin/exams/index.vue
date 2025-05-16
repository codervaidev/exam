<template>
    <div>
        <div class="flex justify-between">
            <AppHeading title="Scheduled Exams" />
            <Button @click="navigateTo('/admin/exams/create')">
                <Icon name="lucide:plus" />
                Schedule Exam
            </Button>
        </div>
        <div v-if="status === 'success'">
            <ExamView v-for="exam in data.body" :key="exam.id" :exam="exam" />
        </div>
        <div v-else class="py-8">
            <AppLoader />
        </div>
    </div>
    <ExamModal />
</template>

<script setup>

definePageMeta({
    layout: 'admin',
})

const { onOpen } = useExam()

const { data, status, error, refresh } = await useFetch('/api/admin/exam', {
    key: 'admin-exams',
})


</script>

<style lang="scss" scoped></style>