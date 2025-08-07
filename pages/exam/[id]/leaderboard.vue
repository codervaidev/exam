<template>
    <div>
        <div class="max-w-3xl p-4 mx-auto ">

            <AppHeading :center="true" title="Leaderboard"
                :subtitle="status === 'success' ? data.examData.title : ''" />

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
                            <TableHead class="text-right">Marks</TableHead>
                            <TableHead class="text-right">Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        <TableRow v-for="rank, i in leaderboard" :key="rank.id" class="hover:bg-gray-50">
                            <TableCell class="flex items-center font-medium">
                                <div v-if="!search" class="flex items-center">
                                    {{ i + 1 }}
                                    <Icon v-if="i < 3" name="lucide:medal" size="16" :class="`inline-block ml-1 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : 'text-amber-600'
                                        }`" />
                                </div>
                            </TableCell>
                            <TableCell>{{ rank.user.name }}</TableCell>
                            <TableCell>{{ rank.user.institute }}</TableCell>
                            <TableCell class="font-semibold text-right">{{ rank.marks }}</TableCell>
                            <TableCell class="text-right">
                                <span class="flex items-center justify-end">
                                    <Icon name="lucide:clock" class="mr-1" size="14" />
                                    {{ millisecToTime(rank.duration, data.examData.duration) }}
                                </span>
                            </TableCell>

                        </TableRow>

                    </TableBody>
                </Table>
            </div>
            <!-- Suspicious Users Section -->
            <div v-if="status === 'success' && data.suspicious && data.suspicious.length > 0" class="mt-8">
                <div class="p-4 mb-2 text-red-700 bg-red-100 border border-red-300 rounded">
                    <strong>Suspicious Submissions:</strong> The following users completed the exam in less than 2
                    minutes. Their responses are flagged as suspicious.
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Institute</TableHead>
                            <TableHead class="text-right">Marks</TableHead>
                            <TableHead class="text-right">Duration</TableHead>
                            <TableHead>Answers</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="user in data.suspicious" :key="user.id" class="bg-red-50">
                            <TableCell>{{ user.user.name }}</TableCell>
                            <TableCell>{{ user.user.institute }}</TableCell>
                            <TableCell class="font-semibold text-right">{{ user.marks }}</TableCell>
                            <TableCell class="text-right">{{ millisecToTime(user.duration, data.examData.duration) }}
                            </TableCell>
                            <TableCell>
                                <span v-if="user.answers && user.answers.length > 0">
                                    {{ user.answers.join(', ') }}
                                </span>
                                <span v-else>-</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div class="my-5">

                <AppLoader v-if="status === 'pending' || loadingMore" />
                <AppEmptyState v-if="status === 'success' && data.leaderboard.length === 0" />

            </div>
        </div>

        <div class="fixed bottom-0 left-0 right-0 bg-white z-50">
            <div class="max-w-3xl mx-auto py-2">
                <div class="flex items-center justify-center">
                    <div class="text-center text-sm text-gray-700">
                        টপ পারফর্মাররা, ACS Future School অ্যাপে লগইন করো—তোমাদের জেমস তোমাদের অপেক্ষায়!
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

const { data, status, error, refresh } = await useLazyFetch(`/api/question/${route.params.id}/leaderboard`, {
    key: 'leaderboard',
    query: {
        search: search
    },
})

watch(data, () => {
    if (!search) {
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
    const response = await fetch(`/api/question/${route.params.id}/leaderboard?page=${page.value}&pageSize=${pageSize}&search=${search.value}`)
    const moreData = await response.json()

    if (moreData.leaderboard && moreData.leaderboard.length > 0) {
        leaderboard.value.push(...moreData.leaderboard)
    }
}


const presearch = ref('')
debouncedWatch(presearch, (value) => {
    search.value = value
    page.value = 1
    refresh()
}, { debounce: 500 })


onMounted(() => {
    window.addEventListener('scroll', onScroll)
})

</script>

<style lang="scss" scoped></style>