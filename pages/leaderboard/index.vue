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

                            <TableCell class="text-right">
                                <span class="text-sm font-medium">
                                    {{ rank.averageMarks }}
                                </span>
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

</script>

<style lang="scss" scoped></style>