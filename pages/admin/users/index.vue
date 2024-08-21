<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
definePageMeta({
    layout: 'admin',
})

import {
    File,
    MoreHorizontal,
    Search,
} from 'lucide-vue-next'

const perpage = ref('10')
const currentPage = ref(1)
const { data, status, error, refresh } = await useFetch('/api/admin/users', {
    key: 'users',
    query: {
        limit: perpage,
        page: currentPage
    }
})


const { toast } = useToast()

const assignRole = async (role: string, user_id: string) => {
    try {
        const data = await $fetch('/api/admin/users/role', {
            method: 'PUT',
            body: {
                role,
                user_id
            }
        })

        if (data) {
            refresh()
            toast({
                title: 'Success',
                description: 'Role assigned successfully',

            })
        }


    } catch (error) {

        toast({
            title: error as string,
            variant: 'destructive'
        })

    }
}


const exportAsCSV = async () => {
    const users = data.value?.users

    const headers = Object.keys(users[0])
    const csv = users.map((row) => {
        return Object.values(row).join(',')
    }).join('\n')

    const blob = new Blob([headers.join(',') + '\n' + csv], { type: 'text/csv' })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
    window.URL.revokeObjectURL(url)


}
const paginate = (page: number) => {
    currentPage.value = page
}


</script>

<template>
    <div class="flex flex-col w-full min-h-screen bg-muted/40">

        <div class="flex flex-col sm:gap-4 sm:py-4 ">

            <main class="grid items-end flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div class="flex items-end justify-between ">
                    <div class="relative">
                        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search..."
                            class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]" />
                    </div>
                    <div class="flex items-end gap-3" v-if="status == 'success'">
                        <div>
                            <Label>
                                Per Page
                            </Label>
                            <Select v-model="perpage">
                                <SelectTrigger class="w-[180px] bg-white">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Per Page</SelectLabel>
                                        <SelectItem v-for="p in ['10', '50', '100', '500']" :value="p" :key="p">
                                            {{ p }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>
                        <Button variant="outline" class="gap-1 " @click="exportAsCSV">
                            <File class="h-3.5 w-3.5" />
                            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </span>
                        </Button>
                    </div>

                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Registered Users</CardTitle>
                        <CardDescription>
                            Manage your users from here
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <Table v-if="status == 'success'">
                            <TableHeader>
                                <TableRow>

                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead class="hidden md:table-cell">
                                        Email
                                    </TableHead>
                                    <TableHead class="hidden md:table-cell">
                                        Batch
                                    </TableHead>
                                    <TableHead class="hidden md:table-cell">
                                        District
                                    </TableHead>
                                    <TableHead>
                                        <span class="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="user in data?.users">

                                    <TableCell class="font-medium">
                                        {{ user?.name }}
                                    </TableCell>
                                    <TableCell>
                                        {{ user?.phone }}
                                    </TableCell>
                                    <TableCell class="hidden md:table-cell">
                                        {{ user?.batch }}
                                    </TableCell>
                                    <TableCell class="hidden md:table-cell">
                                        <Badge>
                                            {{ user?.role }}
                                        </Badge>
                                    </TableCell>
                                    <TableCell class="hidden md:table-cell">
                                        {{ user?.district }}
                                    </TableCell>

                                    <TableCell>
                                        <ClientOnly>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger as-child>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal class="w-4 h-4" />
                                                        <span class="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem @click="assignRole('ADMIN', user.id)">
                                                        Make Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </ClientOnly>
                                    </TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                        <AppLoader v-else />
                    </CardContent>
                    <CardFooter v-if="status == 'success'" class="flex justify-between">
                        <div class="text-xs text-muted-foreground">
                            Showing <strong>1-10</strong> of <strong>{{ data?.totalUsers }}</strong>
                            products
                        </div>
                        <div>
                            <Pagination v-slot="{ page }" @update:page="paginate"
                                :total="data?.totalUsers / perpage * 10" :sibling-count="1" show-edges
                                :default-page="data?.page">
                                <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                                    <PaginationFirst />
                                    <PaginationPrev />

                                    <template v-for="(item, index) in items">
                                        <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value"
                                            as-child>
                                            <Button class="w-10 h-10 p-0"
                                                :variant="item.value === page ? 'default' : 'outline'">
                                                {{ item.value }}
                                            </Button>
                                        </PaginationListItem>
                                        <PaginationEllipsis v-else :key="item.type" :index="index" />
                                    </template>

                                    <PaginationNext />
                                    <PaginationLast />
                                </PaginationList>
                            </Pagination>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    </div>
</template>