<template>
    <div>
        <div class="max-w-4xl p-4 mx-auto ">

            <AppHeading :center="true" title="ক্যাম্পেইন লিডারবোর্ড" />



            <div class="relative mt-4 mb-4">
                <Input type="text" placeholder="Search by name or institute..." class="pl-10" v-model="presearch" />
                <Icon name="lucide:search" class="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                    size="20" />
            </div>
            <div v-if="status === 'success'" class="overflow-hidden bg-white border rounded-lg shadow-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[50px]">Rank</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Institute</TableHead>
                            <TableHead class="text-right">Avg. Marks</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        <TableRow v-for="rank in leaderboard" :key="rank.id" class="hover:bg-gray-50 cursor-pointer"
                            @click="openOverview(rank.id)">
                            <TableCell class="flex items-center font-medium">
                                <div class="flex items-center">
                                    {{ rank.rank }}
                                    <Icon v-if="rank.rank <= 3" name="lucide:medal" size="16" :class="`inline-block ml-1 ${rank.rank === 1 ? 'text-yellow-400' : rank.rank === 2 ? 'text-gray-400' : 'text-amber-600'
                                        }`" />
                                </div>
                            </TableCell>
                            <TableCell>{{ rank.user.name }}</TableCell>
                            <TableCell>{{ rank.user.institute }}</TableCell>

                            <TableCell class="text-right">
                                <span class="text-sm font-medium">
                                    {{ rank.averageMarks }}
                                </span>
                            </TableCell>


                        </TableRow>

                    </TableBody>
                </Table>
            </div>
            <!-- Suspicious Users Section -->
            <div v-if="status === 'success' && data.suspicious && data.suspicious.length > 0" class="mt-8">
                <div class="p-4 mb-2 text-red-700 bg-red-100 border border-red-300 rounded">
                    <strong>Suspicious Submissions:</strong> The following users completed exams with an average
                    duration of less than 2 minutes. Their responses are flagged as suspicious.
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Institute</TableHead>
                            <TableHead class="text-right">Avg. Marks</TableHead>
                            <TableHead class="text-right">Avg. Duration</TableHead>
                            <TableHead>Answers</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="user in data.suspicious" :key="user.id" class="bg-red-50">
                            <TableCell>{{ user.user.name }}</TableCell>
                            <TableCell>{{ user.user.institute }}</TableCell>
                            <TableCell class="font-semibold text-right">{{ user.averageMarks }}</TableCell>
                            <TableCell class="text-right">{{ formatDuration(user.averageDuration) }}</TableCell>
                            <TableCell>
                                <span v-if="user.answers && user.answers.length > 0">
                                    {{ user.answers.flat().join(', ') }}
                                </span>
                                <span v-else>-</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div class="my-5">

                <AppLoader v-if="status === 'pending' || loadingMore" />
                <AppEmptyState v-if="status === 'success' && data.leaderboard.length === 0" title="No participants yet"
                    description="No one has completed any exams in this campaign yet." />

            </div>
        </div>

        <!-- User Overview Modal -->
        <Dialog v-model:open="isOverviewOpen">
            <DialogContent class="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {{ selectedUser?.name || 'User Overview' }}
                    </DialogTitle>
                    <DialogDescription>
                        {{ selectedUser?.institute || '' }}
                    </DialogDescription>
                </DialogHeader>

                <div v-if="isLoadingOverview" class="py-6">
                    <AppLoader />
                </div>
                <div v-else>


                    <div class="overflow-hidden bg-white border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Exam</TableHead>
                                    <TableHead class="text-right">Marks</TableHead>
                                    <TableHead class="text-right">%</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="r in results" :key="r.submissionId">
                                    <TableCell>
                                        {{ r.title }}
                                    </TableCell>
                                    <TableCell class="text-right font-semibold">{{ r.marks }} / {{ r.totalMarks }}
                                    </TableCell>
                                    <TableCell class="text-right">{{ r.percentage }}%</TableCell>
                                </TableRow>
                                <TableRow v-if="!results || results.length === 0">
                                    <TableCell colspan="4" class="text-center text-sm text-gray-500 py-6">No submissions
                                        yet</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <div class="fixed bottom-0 left-0 right-0 bg-white z-50">
            <div class="max-w-3xl mx-auto py-2">
                <div class="flex items-center justify-center">
                    <div class="text-center text-sm text-gray-700">
                        ক্যাম্পেইনে টপ করেছো? তোমার জন্য রয়েছে ১ লক্ষ টাকার পুরস্কার! 🏆
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

const route = useRoute()
const search = ref('')
const page = ref(1)
const pageSize = 25
const leaderboard = ref([])
const loadingMore = ref(false)

const { data, status, error, refresh } = await useLazyFetch(`/api/leaderboard`, {
    key: 'campaign-leaderboard',
    query: {
        search: search
    },
})

watch(data, () => {
    if (!search.value) {
        leaderboard.value = [...leaderboard.value, ...data.value.leaderboard]
    } else {
        leaderboard.value = data.value.leaderboard
    }
})

const onScroll = async () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (data.value.pagination.totalPages === page.value) return

    if (scrollTop + clientHeight >= scrollHeight - 10 && !loadingMore.value) {
        loadingMore.value = true;
        page.value += 1;
        await loadMoreLeaderboard();
        loadingMore.value = false;
    }
};

const loadMoreLeaderboard = async () => {
    const response = await fetch(`/api/leaderboard?page=${page.value}&pageSize=${pageSize}&search=${search.value}`)
    const moreData = await response.json()

    if (moreData.leaderboard && moreData.leaderboard.length > 0) {
        leaderboard.value.push(...moreData.leaderboard)
    }
}

const presearch = ref('')
debouncedWatch(presearch, (value) => {
    search.value = value
    page.value = 1
    leaderboard.value = []
    refresh()
}, { debounce: 500 })

const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / (1000 * 60 * 60))
    const minutes = Math.floor((totalMinutes % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
        return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
}

onMounted(() => {
    window.addEventListener('scroll', onScroll)
})

// Modal state and logic
const isOverviewOpen = ref(false)
const isLoadingOverview = ref(false)
const selectedUser = ref(null)
const overview = ref(null)
const results = ref([])

const openOverview = async (userId) => {
    isOverviewOpen.value = true
    isLoadingOverview.value = true
    try {
        const res = await $fetch(`/api/leaderboard/${userId}`)
        selectedUser.value = res.user
        overview.value = res.overview
        results.value = res.results
    } catch (e) {
        // noop; optionally toast
    } finally {
        isLoadingOverview.value = false
    }
}

</script>

<style lang="scss" scoped></style>