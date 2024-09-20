<template>
    <AppContainer>
        <Card class="mb-8">
            <CardHeader>
                <CardTitle>Student Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-2 gap-6">
                    <div class="flex flex-col">
                        <Label class="mb-1 text-sm font-medium text-muted-foreground">Name</Label>
                        <div class="flex items-center">

                            {{ userInfo.name }}
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <Label class="mb-1 text-sm font-medium text-muted-foreground">Phone</Label>
                        <div class="flex items-center">
                            {{ userInfo.phone }}
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <Label class="mb-1 text-sm font-medium text-muted-foreground">Institute</Label>
                        <div class="flex items-center">
                            {{ userInfo.institute }}
                        </div>
                    </div>


                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Exam Results</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Exam Title</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead>Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="(mark, index) in marks" :key="index">
                            <TableCell>{{ mark.exam.title }}</TableCell>
                            <TableCell>{{ mark.marks }}</TableCell>
                            <TableCell>{{ millisecToTime(mark.duration, mark.exam.duration) }} minutes</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </AppContainer>
</template>

<script setup lang="ts">

const { data: marks, status } = await useFetch("/api/auth/profile")
const user = useUser()

const userInfo = computed(() => ({
    name: user.value?.name,
    phone: user.value?.phone,
    role: user.value?.role,
    institute: user.value?.institute,
    id: user.value?.id,
}))
</script>