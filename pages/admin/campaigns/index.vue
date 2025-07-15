<template>
    <div>
        <div class="flex justify-between mb-6">
            <AppHeading title="Campaigns" />
            <Button @click="openCreateModal">
                <Icon name="lucide:plus" />
                Create Campaign
            </Button>
        </div>

        <div v-if="status === 'success'" class="space-y-4">
            <Card v-for="campaign in data.body" :key="campaign.id">
                <CardHeader>
                    <div class="flex justify-between items-start">
                        <div>
                            <CardTitle>{{ campaign.title }}</CardTitle>
                            <CardDescription>{{ campaign.description }}</CardDescription>
                        </div>
                        <div class="flex gap-2">
                            <Badge
                                :variant="campaign.status === 'active' ? 'default' : campaign.status === 'completed' ? 'secondary' : 'outline'">
                                {{ campaign.status }}
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <Button variant="ghost" size="icon">
                                        <Icon name="lucide:more-horizontal" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem @click="editCampaign(campaign)">
                                        <Icon name="lucide:edit" class="mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @click="deleteCampaign(campaign.id)" class="text-red-600">
                                        <Icon name="lucide:trash" class="mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span class="font-medium">Level:</span>
                            <p>{{ campaign.level }}</p>
                        </div>
                        <div>
                            <span class="font-medium">Total Exams:</span>
                            <p>{{ campaign.total_exam }}</p>
                        </div>
                        <div>
                            <span class="font-medium">Start Time:</span>
                            <p>{{ formatDateTime(campaign.start_time) }}</p>
                        </div>
                        <div>
                            <span class="font-medium">End Time:</span>
                            <p>{{ formatDateTime(campaign.end_time) }}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div v-else class="py-8">
            <AppLoader />
        </div>

        <!-- Campaign Modal -->
        <Dialog v-model:open="isModalOpen">
            <DialogContent class="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{{ isEditing ? 'Edit' : 'Create' }} Campaign</DialogTitle>
                </DialogHeader>
                <form @submit="onSubmit" class="space-y-4">
                    <FormField v-slot="{ componentField }" name="title">
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Campaign title..." v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="description">
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Campaign description..." v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <div class="grid grid-cols-2 gap-4">
                        <FormField v-slot="{ componentField }" name="startTime">
                            <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="endTime">
                            <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                    <Input type="datetime-local" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <FormField v-slot="{ componentField }" name="level">
                            <FormItem>
                                <FormLabel>Level</FormLabel>
                                <FormControl>
                                    <Select v-bind="componentField">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="6">6</SelectItem>
                                            <SelectItem value="7">7</SelectItem>
                                            <SelectItem value="8">8</SelectItem>
                                            <SelectItem value="9">9</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="status" v-if="isEditing">
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select v-bind="componentField">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="flex justify-end gap-2">
                        <Button type="button" variant="outline" @click="closeModal">Cancel</Button>
                        <Button type="submit" :loading="isLoading">
                            {{ isEditing ? 'Update' : 'Create' }} Campaign
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { CampaignSchema } from '~/schema/exam.schema';
import { format } from 'date-fns'

definePageMeta({
    layout: 'admin',
})

const { toast } = useToast()
const isModalOpen = ref(false)
const isEditing = ref(false)
const isLoading = ref(false)
const currentCampaign = ref(null)

const { data, status, error, refresh } = await useFetch('/api/admin/campaigns', {
    key: 'admin-campaigns',
})

const form = useForm({
    schema: toTypedSchema(CampaignSchema),
    defaultValues: {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        level: '',
        status: 'pending'
    }
})

const openCreateModal = () => {
    isEditing.value = false
    currentCampaign.value = null
    form.resetForm()
    isModalOpen.value = true
}

const editCampaign = (campaign) => {
    isEditing.value = true
    currentCampaign.value = campaign
    form.setValues({
        title: campaign.title,
        description: campaign.description,
        startTime: formatDateForInput(campaign.start_time),
        endTime: formatDateForInput(campaign.end_time),
        level: campaign.level,
        status: campaign.status
    })
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
    form.resetForm()
}

const deleteCampaign = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
        await $fetch(`/api/admin/campaigns/${id}`, {
            method: 'DELETE'
        })
        toast({
            title: 'Success',
            description: 'Campaign deleted successfully'
        })
        refresh()
    } catch (error) {
        toast({
            title: 'Error',
            description: error.data?.statusMessage || 'Failed to delete campaign',
            variant: 'destructive'
        })
    }
}

const onSubmit = form.handleSubmit(async (data) => {
    try {
        isLoading.value = true

        if (isEditing.value && currentCampaign.value) {
            await $fetch(`/api/admin/campaigns/${currentCampaign.value.id}`, {
                method: 'PUT',
                body: data
            })
            toast({
                title: 'Success',
                description: 'Campaign updated successfully'
            })
        } else {
            await $fetch('/api/admin/campaigns', {
                method: 'POST',
                body: data
            })
            toast({
                title: 'Success',
                description: 'Campaign created successfully'
            })
        }

        closeModal()
        refresh()
    } catch (error) {
        toast({
            title: 'Error',
            description: error.data?.statusMessage || 'Failed to save campaign',
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})

const formatDateTime = (dateString) => {
    try {
        return format(new Date(dateString), 'PPp')
    } catch {
        return dateString
    }
}

const formatDateForInput = (dateString) => {
    try {
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16)
    } catch {
        return ''
    }
}
</script>