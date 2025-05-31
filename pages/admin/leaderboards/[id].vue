<template>
    <div v-if="status === 'success'">
        <div class="max-w-3xl p-4 mx-auto ">

            <AppHeading :center="true" title="Leaderboard"
                :subtitle="status === 'success' ? data.examData.title : ''" />

            <h3 class="text-lg font-semibold text-center text-gray-600">
                Total Participants: {{ data.pagination.total }}
            </h3>

            <div class="relative mt-4 mb-4">
                <Input type="text" placeholder="Search by name or institute..." class="pl-10" v-model="presearch" />
                <Icon name="lucide:search" class="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                    size="20" />

            </div>
            <div class="flex justify-end mb-3">
                <!-- <Button @click="showAllResults" class="mr-2">
                    <Icon name="lucide:list" class="mr-1" size="16" />
                    Show All Results
                </Button> -->
                <AppLoader v-if="exportLoading" />
                <Button v-else @click="exportAsCsv" :disabled="exportLoading">

                    <Icon name="lucide:download" class="mr-1" size="16" />
                    Export as CSV
                </Button>
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
                            <TableHead class="text-right">Action</TableHead>
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
                            <TableCell>
                                <div>
                                    <p>
                                        {{ rank.user.name }}
                                    </p>
                                    <p>
                                        {{ rank.user.phone }}
                                    </p>
                                    <p>
                                        {{ rank.user.tshirt }}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p>
                                        {{ rank.user.institute }}
                                    </p>
                                    <p>
                                        {{ rank.user.address }}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell class="font-semibold text-right">{{ rank.marks }}</TableCell>
                            <TableCell class="text-right">
                                <span class="flex items-center justify-end">
                                    <Icon name="lucide:clock" class="mr-1" size="14" />
                                    {{ millisecToTime(rank.duration, data.examData.duration) }}
                                </span>
                            </TableCell>
                            <TableCell class="text-right">
                                <Button variant="ghost" size="icon" @click="deleteSubmission(rank.id)">
                                    <Icon name="lucide:trash" size="16" />
                                </Button>
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
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
})

const route = useRoute()
const search = ref('')
const page = ref(1)
const pageSize = 25
const leaderboard = ref([])
const loadingMore = ref(false)

const { data, status, error, refresh } = await useLazyFetch(`/api/admin/exam/${route.params.id}/leaderboard`, {
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
    const response = await fetch(`/api/admin/exam/${route.params.id}/leaderboard?page=${page.value}&pageSize=${pageSize}&search=${search.value}`)
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

const deleteSubmission = async (id) => {
    const response = await fetch(`/api/question/${route.params.id}/${id}`, {
        method: 'DELETE',
    })
    const data = await response.json()

    refresh()
}

const showAllResults = async () => {
    loadingMore.value = true;
    const response = await fetch(`/api/admin/exam/${route.params.id}/leaderboard?page=1&pageSize=9999&search=${search.value}`)
    const allData = await response.json()
    leaderboard.value = allData.leaderboard
    loadingMore.value = false;
}


const exportLoading = ref(false)


const exportAsCsv = async () => {
    exportLoading.value = true;


    const response = await fetch(`/api/admin/exam/${route.params.id}/leaderboard?page=1&pageSize=9999&search=${search.value}`)
    const allData = await response.json()
    const allLeaderboard = allData.leaderboard

    let csv = "Rank,Name,Institute,Phone,T-Shirt,Address,District,Marks,Duration\n"

    allLeaderboard.forEach((rank, i) => {
        csv += `${i + 1},${rank.user.name},${rank.user.institute.replace(/,/g, ' ')},${`"'${rank.user.phone}"`},${rank.user.tshirt},${`"${rank.user.address}"`},${`"${rank.user.district}"`},${rank.marks},${millisecToTime(rank.duration, data.value.examData.duration)}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'leaderboard.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    exportLoading.value = false;
}

</script>

<style lang="scss" scoped></style>