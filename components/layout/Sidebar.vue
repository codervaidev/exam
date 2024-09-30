<script setup lang="ts">
import { Triangle } from 'lucide-vue-next'
import { navMenu, navMenuBottom } from '~/constants/menus'
import { cn } from '@/lib/utils'
import type { NavGroup, NavLink, NavSectionTitle } from '~/types/nav'

const store = useNavbar()
const { toggle } = store

const { isOpen } = storeToRefs(store)

function resolveNavItemComponent(item: NavLink | NavGroup | NavSectionTitle) {
  if ('heading' in item)
    return resolveComponent('LayoutNavHeading')
  else if ('children' in item)
    return resolveComponent('LayoutNavGroup')

  return resolveComponent('LayoutNavLink')
}
</script>

<template>
  <aside
    class="fixed print:hidden left-0 z-20 flex-col items-center hidden h-full duration-300 border-r inset-y bg-background transition-width sm:flex"
    :class="cn('w-20 lg:w-64', isOpen ? 'lg:w-64' : 'lg:w-20')">
    <div class="relative px-3 py-2 text-center border-b" :class="cn('w-20 lg:w-64', isOpen ? 'lg:w-64' : 'lg:w-20')">
      <div class="flex items-center gap-3"
        :class="cn('justify-center lg:justify-start', isOpen ? 'lg:justify-start' : 'lg:justify-center')">
        <Button variant="outline" size="icon" aria-label="Home">
          <Icon name="lucide:triangle" class="size-5 fill-foreground" />
        </Button>
        <span v-if="isOpen" class="hidden text-xl font-semibold lg:inline-block">Dashboard</span>
      </div>

      <Button variant="outline" class="absolute hidden p-0 rounded-full top-4 size-6 -right-3 lg:inline-flex"
        @click="toggle">
        <Icon :name="isOpen ? 'radix-icons:chevron-left' : 'radix-icons:chevron-right'" />
      </Button>
    </div>
    <ScrollArea class="w-full">
      <nav class="grid w-full gap-1 p-2">
        <component :is="resolveNavItemComponent(item)" v-for="(item, index) in navMenu" :key="index" :item="item" />
      </nav>
    </ScrollArea>
    <nav class="grid w-full gap-1 p-2 mt-auto">
      <component :is="resolveNavItemComponent(item)" v-for="(item, index) in navMenuBottom" :key="index" :item="item" />
    </nav>
  </aside>
</template>

<style scoped></style>
