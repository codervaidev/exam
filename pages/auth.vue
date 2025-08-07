<template>
    <div class="max-w-2xl mx-auto">

        <div>
            <h1 class="text-xl font-medium my-4">তোমার ডিটেইলস দাও</h1>
            <form @submit.prevent="onSubmit">

                <div class="space-y-6">
                    <FormField v-slot="{ componentField }" name="name">
                        <FormItem>
                            <Label>তোমার নাম*</Label>
                            <p class="text-sm text-red-500 mt-1">
                                ভুল নাম ব্যবহার করলে পুরস্কার বা সার্টিফিকেট দেওয়া হবে না।
                            </p>
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
                    <FormField v-slot="{ componentField }" name="level">
                        <FormItem>
                            <Label>তোমার শ্রেণি*</Label>
                            <FormControl>
                                <Input disabled
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-base placeholder-gray-400 font-normal"
                                    placeholder="SSC 2026" value="SSC 2026" />
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
        level: '10',
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

    } catch (error: any) {
        toast({
            title: error instanceof Error ? error.message : 'An unknown error occurred',
            variant: 'destructive'
        });
    } finally {
        isLoading.value = false;
    }
});



</script>

<style scoped></style>