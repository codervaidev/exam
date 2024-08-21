<template>
    <div>
        <div class="max-w-3xl p-4 mx-auto ">

            <AppHeading :center="true" title="Leaderboard"
                :subtitle="status === 'success' ? data.examData.title : ''" />

            <div class="relative mt-4 mb-4">
                <Input type="text" placeholder="Search by name or institute..." class="pl-10" v-model="search" />
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

                        <TableRow v-for="rank, i in data.leaderboard" :key="rank.id" class="hover:bg-gray-50">
                            <TableCell class="flex items-center font-medium">
                                {{ i + 1 }}
                                <Icon name="lucide:medal" size="16" :class="`inline-block ml-1 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : 'text-amber-600'
                }`" />
                            </TableCell>
                            <TableCell>{{ rank.user.name }}</TableCell>
                            <TableCell>{{ rank.user.institute }}</TableCell>
                            <TableCell class="font-semibold text-right">{{ rank.marks }}</TableCell>
                            <TableCell class="text-right">
                                <span class="flex items-center justify-end">
                                    <Icon name="lucide:clock" class="mr-1" size="14" />
                                    {{ millisecToTime(rank.duration) }}
                                </span>
                            </TableCell>

                        </TableRow>

                    </TableBody>
                </Table>
            </div>
        </div>
    </div>
</template>

<script setup>


const route = useRoute()

const search = ref('')

const { data, status, error, refresh } = await useFetch('/api/question/' + route.params.id + '/leaderboard', {
    key: 'leaderboard',
    query: {
        search
    },
    watch: [search]
})
</script>

<style lang="scss" scoped></style>