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
            <Card>
                <CardHeader>
                    <CardTitle>Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-4xl font-bold">{{ data.campaignCount }}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Registrations (7d)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-4xl font-bold">{{ data.recentRegistrations }}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Submissions (7d)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-4xl font-bold">{{ data.recentSubmissions }}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Avg Exam Attempts/User</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-4xl font-bold">{{ data.avgExamAttempts.toFixed(2) }}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Avg Score/Exam</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-4xl font-bold">{{ data.avgScorePerExam.toFixed(2) }}</div>
                </CardContent>
            </Card>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
                <h2 class="text-xl font-semibold mb-2">User Growth (30d)</h2>
                <!-- <BarChart :data="data.userGrowth" :categories="['count']" index="date" :rounded-corners="4" /> -->
            </div>
            <div>
                <h2 class="text-xl font-semibold mb-2">Submission Growth (30d)</h2>
                <!-- <BarChart :data="data.submissionGrowth" :categories="['count']" index="date" :rounded-corners="4" /> -->
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div>
                <h2 class="text-xl font-semibold mb-2">Top Performing Users</h2>
                <table class="min-w-full bg-white border border-gray-200 rounded">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 text-left">Name</th>
                            <th class="px-4 py-2 text-left">Avg Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in data.topUsers" :key="user.user_id">
                            <td class="px-4 py-2">{{ user.name }}</td>
                            <td class="px-4 py-2">{{ user.avg_marks.toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <h2 class="text-xl font-semibold mb-2">Most Attempted Exams</h2>
                <table class="min-w-full bg-white border border-gray-200 rounded">
                    <thead>
                        <tr>
                            <th class="px-4 py-2 text-left">Title</th>
                            <th class="px-4 py-2 text-left">Attempts</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="exam in data.mostAttemptedExams" :key="exam.exam_id">
                            <td class="px-4 py-2">{{ exam.title }}</td>
                            <td class="px-4 py-2">{{ exam.attempts }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
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