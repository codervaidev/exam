<template>
    <div class="space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-4xl font-bold">{{ data.userCount }}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Exams</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-4xl font-bold">{{ data.examCount }}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-4xl font-bold">{{ data.submissionCount }}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-4xl font-bold">{{ data.questionCount }}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-4xl font-bold">{{ data.activeSessionCount }}</div>
                </CardContent>
            </Card>
        </div>





    </div>
</template>

<script setup>

definePageMeta({
    layout: 'admin'
})

const { data, status, error, refresh } = await useFetch('/api/admin/dashboard', {

})

</script>

<style lang="scss" scoped></style>