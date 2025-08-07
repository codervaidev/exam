<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Profile Header -->
            <div class=" rounded-2xl p-4 mb-8 ">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                        <p class="text-gray-600">Manage your account information</p>
                    </div>
                    <div class="relative">
                        <div
                            class="w-28 h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                            <span class="text-4xl font-bold text-white">{{ userInfo.name?.charAt(0)?.toUpperCase()
                            }}</span>
                        </div>
                        <div
                            class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                            <Icon name="heroicons:check" class="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>

                <!-- Profile Information -->
                <div class="">
                    <!-- Personal Information -->
                    <div class="space-y-6">
                        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Icon name="heroicons:user-circle" class="w-5 h-5 mr-2 text-blue-600" />
                            Personal Information
                        </h2>

                        <!-- Name Field -->
                        <div class="bg-gray-50 rounded-xl p-6">
                            <div class="flex items-center justify-between mb-3">
                                <label class="block text-sm font-medium text-gray-500">Full Name</label>
                                <button @click="toggleNameEdit"
                                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                    <Icon v-if="!editingName" name="heroicons:pencil-square" class="w-5 h-5" />
                                    <Icon v-else name="heroicons:x-mark" class="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                            <div v-if="!editingName" class="text-lg font-semibold text-gray-900">{{ userInfo.name }}
                            </div>
                            <div v-else class="space-y-3">
                                <input v-model="editForm.name" type="text"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                    placeholder="Enter your full name" />
                                <div class="flex gap-3">
                                    <button @click="saveName" :disabled="isLoading"
                                        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center">
                                        <Icon v-if="isLoading" name="heroicons:arrow-path"
                                            class="w-4 h-4 mr-2 animate-spin" />
                                        <Icon v-else name="heroicons:check" class="w-4 h-4 mr-2" />
                                        Save
                                    </button>
                                    <button @click="cancelNameEdit"
                                        class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Phone Field -->
                        <div class="bg-gray-50 rounded-xl p-6">
                            <label class="block text-sm font-medium text-gray-500 mb-3">Phone Number</label>
                            <p class="text-lg font-semibold text-gray-900">{{ userInfo.phone }}</p>
                        </div>

                        <!-- Institute Field -->
                        <div class="bg-gray-50 rounded-xl p-6">
                            <div class="flex items-center justify-between mb-3">
                                <label class="block text-sm font-medium text-gray-500">Institute</label>
                                <button @click="toggleInstituteEdit"
                                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                    <Icon v-if="!editingInstitute" name="heroicons:pencil-square" class="w-5 h-5" />
                                    <Icon v-else name="heroicons:x-mark" class="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                            <div v-if="!editingInstitute" class="text-lg font-semibold text-gray-900">{{
                                userInfo.institute || 'Not specified' }}</div>
                            <div v-else class="space-y-3">
                                <input v-model="editForm.institute" type="text"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                    placeholder="Enter your institute name" />
                                <div class="flex gap-3">
                                    <button @click="saveInstitute" :disabled="isLoading"
                                        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center">
                                        <Icon v-if="isLoading" name="heroicons:arrow-path"
                                            class="w-4 h-4 mr-2 animate-spin" />
                                        <Icon v-else name="heroicons:check" class="w-4 h-4 mr-2" />
                                        Save
                                    </button>
                                    <button @click="cancelInstituteEdit"
                                        class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Update Modal -->
        <UpdateModal />
    </div>
</template>

<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'

const user = useUser()
const { toast } = useToast()
const { onOpen } = useUpdate()

const editingName = ref(false)
const editingInstitute = ref(false)
const isLoading = ref(false)

const editForm = reactive({
    name: '',
    institute: ''
})

const userInfo = computed(() => ({
    name: user.value?.name,
    phone: user.value?.phone,
    institute: user.value?.institute,
    level: user.value?.level,
    createdAt: user.value?.created_at,
}))

const toggleNameEdit = () => {
    if (!editingName.value) {
        editForm.name = userInfo.value.name || ''
        editingName.value = true
    }
}

const toggleInstituteEdit = () => {
    if (!editingInstitute.value) {
        editForm.institute = userInfo.value.institute || ''
        editingInstitute.value = true
    }
}

const cancelNameEdit = () => {
    editingName.value = false
    editForm.name = ''
}

const cancelInstituteEdit = () => {
    editingInstitute.value = false
    editForm.institute = ''
}

const saveName = async () => {
    if (!editForm.name.trim()) {
        toast({
            title: 'Error',
            description: 'Name cannot be empty',
            variant: 'destructive'
        })
        return
    }

    try {
        isLoading.value = true
        const response = await $fetch('/api/auth/update-profile', {
            method: 'POST',
            body: { name: editForm.name }
        })

        if (response) {
            await refreshProfile()
            editingName.value = false
            toast({
                title: 'Success',
                description: 'Name updated successfully',
            })
        }
    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message || 'Failed to update name',
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
}

const saveInstitute = async () => {
    try {
        isLoading.value = true
        const response = await $fetch('/api/auth/update-profile', {
            method: 'POST',
            body: { institute: editForm.institute }
        })

        if (response) {
            await refreshProfile()
            editingInstitute.value = false
            toast({
                title: 'Success',
                description: 'Institute updated successfully',
            })
        }
    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message || 'Failed to update institute',
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
}

const refreshProfile = async () => {
    try {
        const data = await useRequestFetch()("/api/user")
        if (data) {
            user.value = data
        }
    } catch (error) {
        console.error('Failed to refresh profile:', error)
    }
}

const openUpdateModal = () => {
    // This will open the existing UpdateModal component
    onOpen()
}

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>