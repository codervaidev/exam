<template>
    <div class="w-full bg-[#DFE2E6]">
        <div class="fixed left-0 right-0 z-50 max-w-6xl px-4 mx-auto top-3">
            <div
                class="flex items-center justify-between px-4 py-2 border-2 border-white rounded-full backdrop-blur-sm bg-gradient-to-r from-white to-white/50">
                <NavbarLogo />



                <!-- Mobile Menu Button -->
                <Button variant="ghost" class="md:hidden" @click="isMobileMenuOpen = !isMobileMenuOpen">
                    <MenuIcon v-if="!isMobileMenuOpen" class="w-6 h-6" />
                    <XIcon v-else class="w-6 h-6" />
                </Button>

                <!-- User Profile Dropdown -->
                <div v-if="user" class="relative items-center hidden gap-2 md:flex">
                    <DropdownMenu>
                        <DropdownMenuTrigger class="flex items-center gap-2">
                            <Avatar class="w-8 h-8 bg-gray-200">

                                <AvatarFallback>
                                    {{ user.name.charAt(0) }}
                                </AvatarFallback>
                            </Avatar>
                            <div class="flex flex-col items-start">

                                <p class="font-medium text-sm">{{ user.name }}</p>
                                <p class="text-xs text-gray-500">
                                    {{ gradeMap[user.level] }} শ্রেণি
                                </p>
                            </div>
                            <ChevronDownIcon class="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem @click="logout">
                                <LogOutIcon class="w-4 h-4 mr-2" />
                                লগআউট
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div v-else>
                    <button @click="navigateTo('/auth')" class="bg-[#FC465D]  text-white px-4 py-2 rounded-full">
                        লগ-ইন
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu -->
        <Transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isMobileMenuOpen" class="fixed inset-x-0 z-40 px-4 pb-6 mt-16 bg-white md:hidden">
                <div v-if="user" class="pt-4 mt-4 border-gray-200">
                    <div class="flex items-center px-3 py-2">
                        <img src="https://avatar.iran.liara.run/public/boy" alt="logo" class="w-8 h-8 rounded-full">
                        <p class="ml-3 font-medium">{{ user.name }}</p>
                    </div>

                    <button @click="logout"
                        class="block w-full px-3 py-2 text-base font-medium text-left hover:bg-gray-100">
                        লগআউট
                    </button>
                </div>
                <div v-else>
                    <button>
                        লগ-ইন
                    </button>
                </div>
                <div class="hidden space-y-1">
                    <template v-for="menu in menus" :key="menu.name">
                        <NuxtLink v-if="!menu.children" :to="menu.path"
                            class="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
                            :class="{ 'text-blue-500': menu.path === $route.path }">
                            {{ menu.name }}
                        </NuxtLink>
                        <div v-else class="space-y-1">
                            <button @click="toggleSubmenu(menu.name)"
                                class="flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100">
                                {{ menu.name }}
                                <ChevronDownIcon class="w-4 h-4"
                                    :class="{ 'transform rotate-180': openSubmenus[menu.name] }" />
                            </button>
                            <div v-if="openSubmenus[menu.name]" class="pl-4">
                                <NuxtLink v-for="child in menu.children" :key="child.name" :to="child.path"
                                    class="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100">
                                    {{ child.name }}
                                </NuxtLink>
                            </div>
                        </div>
                    </template>
                    <!-- Mobile Profile Options -->

                </div>
            </div>
        </Transition>

        <!-- Spacer to prevent content jump -->
        <div class="h-24"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    ChevronDownIcon,
    MenuIcon,
    XIcon,
    UserIcon,
    SettingsIcon,
    LogOutIcon
} from 'lucide-vue-next'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const isMobileMenuOpen = ref(false)
const openSubmenus = ref({})

const user = useUser()


const gradeMap = {
    6: '৬ষ্ঠ',
    7: '৭ম',
    8: '৮ম',
    9: '৯ম',
    10: '১০ম',
}



async function logout() {
    await $fetch('/api/auth/logout', {
        method: 'POST'
    })
    user.value = null
    navigateTo('/')
}
</script>

<style lang="scss" scoped></style>