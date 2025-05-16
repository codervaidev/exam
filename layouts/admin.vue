<script setup lang="ts">
const store = useNavbar()
const { isOpen } = storeToRefs(store)
const { isBgWhite } = storeToRefs(useAppConf())
const { theme, radius } = useCustomize()

useServerHead({
    bodyAttrs: {
        class: `theme-${theme.value}`,
        style: `--radius: ${radius.value}rem;`,
    },
})

const router = useRouter()

defineShortcuts({
    'Meta_B': () => store.toggle(),
    'G-H': () => router.push('/'),
    'G-E': () => router.push('/email'),
})


const user = useUser()

</script>

<template>
    <div v-if="user?.role === 'ADMIN'" class="grid w-full duration-300 transition-width min-h-dvh "
        :class="cn('pl-0 lg:pl-64 sm:pl-20 print:pl-0', isOpen ? 'lg:pl-64 sm:pl-20' : 'lg:pl-20')">
        <LayoutSidebar />
        <div flex="~ col">
            <LayoutHeader />
            <main class="flex-1 p-4 lg:p-6 min-h-[calc(100vh-53px)] print:bg-white"
                :class="isBgWhite ? 'bg-background' : 'bg-muted dark:bg-muted/20'">
                <slot />
            </main>
        </div>
    </div>

</template>

<style scoped></style>
