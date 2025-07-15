<template>
    <AppModal :isOpen="isOpen" @close="isOpen = false" title="তোমার ডিটেইলস দাও" size="md">
        <form @submit.prevent="onSubmit">

            <div class="space-y-6">
                <FormField v-slot="{ componentField }" name="name">
                    <FormItem>
                        <Label>তোমার নাম*</Label>
                        <FormControl>
                            <Input
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 font-normal"
                                placeholder="তোমার হাসান" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="phone">
                    <FormItem>
                        <Label>মোবাইল নম্বর*</Label>
                        <FormControl>
                            <Input type="tel"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-base placeholder-gray-400 font-normal"
                                placeholder="01788201425" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="institute">
                    <FormItem>
                        <Label>তোমার স্কুল*</Label>
                        <FormControl>
                            <Input type="text"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 font-normal"
                                placeholder="আমান হাসান" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>




            </div>

            <div class="flex flex-col gap-2 py-6">
                <div class="flex flex-row items-center w-full gap-4">
                    <button type="submit"
                        class="flex special_effect outline-none border-none text-lg text-center justify-center text-white items-center w-full h-12 font-medium bg-[#008643] shadow-lg rounded-2xl duration-200 hover:bg-[#007b3a]">
                        সাবমিট করো
                    </button>
                </div>
            </div>
        </form>
    </AppModal>
</template>

<script setup>


</script>


<style lang="scss" scoped></style>