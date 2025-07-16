<template>
    <div class="max-w-2xl mx-auto">
        <div v-if="!regForm || !selectedGrade" class="w-full max-w-2xl p-5 mx-auto bg-white rounded-2xl">
            <div>
                <h1 class="text-xl font-medium">তুমি কোন শ্রেণিতে পড়ছো এখন?</h1>
            </div>

            <div class="flex flex-col gap-4 py-4">
                <div v-for="(grade, index) in grades" :key="index" @click="selectGrade(grade.value)"
                    class="flex items-center justify-between w-full gap-4 p-3 text-lg transition-all duration-200 border-2 border-gray-200 rounded-2xl hover:scale-102"
                    :class="{ '!border-[#008643]': grade.value == selectedGrade }">

                    <div class="flex items-center gap-4">
                        <img :src="grade.icon" alt="grade" class="w-10 h-10">
                        <span class="text-lg font-thin">{{ grade.name }} শ্রেণী</span>
                    </div>


                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8.5" y="8.5" width="15" height="15" rx="7.5" fill="white" />
                        <rect x="8.5" y="8.5" width="15" height="15" rx="7.5" stroke="#008643" />
                        <circle v-if="grade.value === selectedGrade" cx="16" cy="16" r="3" fill="#008643" />
                    </svg>


                </div>
            </div>

            <div class="">
                <button @click="confirmSelection"
                    class="flex special_effect outline-none border-none text-lg text-center justify-center text-white items-center w-full h-12 font-medium bg-[#008643] shadow-lg rounded-2xl  duration-200 hover:bg-[#007b3a]">
                    এগিয়ে যাও
                </button>
            </div>
        </div>
        <div v-else>
            <h1 class="text-xl font-medium my-4">তোমার ডিটেইলস দাও</h1>
            <form @submit.prevent="onSubmit">

                <div class="space-y-6">
                    <FormField v-slot="{ componentField }" name="name">
                        <FormItem>
                            <Label>তোমার নাম*</Label>
                            <FormControl>
                                <Input
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 font-normal"
                                    placeholder="তোমার নাম" v-bind="componentField" />
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
                                    placeholder="01XXXXXXXX" v-bind="componentField" />
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
                                    placeholder="তোমার স্কুল" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>




                </div>

                <div class="flex flex-col gap-2 py-6">
                    <div class="flex flex-row items-center w-full gap-4">
                        <button type="submit"
                            class="flex special_effect outline-none border-none text-lg text-center justify-center text-white items-center w-full h-12 font-medium bg-[#008643] shadow-lg rounded-2xl duration-200 hover:bg-[#007b3a]">
                            {{ isLoading ? 'সাবমিট হচ্ছে...' : 'সাবমিট করো' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>

    </div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useToast } from '@/components/ui/toast/use-toast'
import { RegisterSchema } from '~/schema/register.schema';

definePageMeta({
    title: 'Login',
    description: 'Login to your account',

    middleware: 'guest'
})

const grades = [
    {
        name: "৬ষ্ঠ",
        icon: '/images/6.png',
        value: 6
    },
    {
        name: "৭ম",
        icon: '/images/7.png',
        value: 7
    },
    {
        name: "৮ম",
        icon: '/images/8.png',
        value: 8
    },
    {
        name: "৯ম",
        icon: '/images/9.png',
        value: 9
    },
    {
        name: "১০ম",
        icon: '/images/10.png',
        value: 10
    },


]
const selectedGrade = ref<number | null>(null)

const selectGrade = (grade: number) => {
    selectedGrade.value = grade
}

const regForm = ref(false)


const confirmSelection = () => {
    if (selectedGrade.value) {
        regForm.value = true
    }
}





const formSchema = toTypedSchema(RegisterSchema);
const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        phone: '',
        institute: '',
        level: selectedGrade.value?.toString() || '9',
    },
});

const isLoading = ref(false);

const { toast } = useToast();
const user = useUser();

const assignUser = async () => {
    const data = await useRequestFetch()("/api/user");
    if (data) {
        user.value = data;
    }
    navigateTo('/')
}

const onSubmit = form.handleSubmit(async () => {
    try {
        isLoading.value = true;

        const data = await $fetch('/api/auth/signup', {
            method: 'POST',
            body: form.values
        })

        if (!data) {
            return;
        }
        await assignUser();

        return navigateTo('/')

    } catch (error) {
        toast({
            title: error.toString(),
            variant: 'destructive'
        });
    } finally {
        isLoading.value = false;
    }
});



</script>

<style scoped></style>