<template>
    <LayoutAuth>
        <div class="grid max-w-sm gap-6 mx-auto">
            <div class="grid gap-2">
                <img src="/logo.png" alt="logo" class="h-16 mx-auto mb-10" />
                <h3 class="text-xl font-bold lg:hidden text-slate-800">
                    Rhombus <span class="text-red-400">Parallel</span> Science Hub
                </h3>
                <h1 class="hidden text-2xl font-semibold tracking-tight lg:block">
                    Register
                </h1>
                <p class="text-sm text-muted-foreground">
                    Please fill in the details to register.
                </p>
                <form @submit.prevent="onSubmit">

                    <div class="space-y-6">
                        <FormField v-slot="{ componentField }" name="name">
                            <FormItem>
                                <Label>Name</Label>
                                <FormControl>
                                    <Input placeholder="Full Name" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="phone">
                            <FormItem>
                                <Label>Phone Number</Label>
                                <FormControl>
                                    <Input disabled type="tel" placeholder="01X-XXXX-XXXX" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="district">
                            <FormItem>
                                <FormLabel>District</FormLabel>
                                <FormControl>
                                    <Select v-bind="componentField" @update:modelValue="handleDistrictChange">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select District" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem v-for="district in districts" :key="district.id"
                                                    :value="district.name">
                                                    {{ district.name }}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="thana">
                            <FormItem>
                                <FormLabel>Thana</FormLabel>
                                <FormControl>
                                    <Select v-bind="componentField" :disabled="!form.values.district"
                                        @update:modelValue="handleThanaChange">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Thana" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem v-for="thana in thanas" :key="thana.id" :value="thana.name">
                                                    {{ thana.name }}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="institute">
                            <FormItem>
                                <FormLabel>Institute Name</FormLabel>
                                <FormControl>
                                    <Select v-bind="componentField" :disabled="!form.values.thana">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Institute" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem v-for="school in schools" :key="school.school_name"
                                                    :value="school.school_name">
                                                    {{ school.school_name }}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="batch">
                            <FormItem>
                                <FormLabel>HSC Batch</FormLabel>
                                <Select v-bind="componentField">
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your HSC BATCH" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup v-for="b in hsc_batches" :key="b">
                                            <SelectItem :value="b">
                                                {{ b }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="flex flex-col gap-2 py-6">
                        <div class="flex flex-row items-center w-full gap-4">
                            <AppButton type="submit" class="w-full" label="Register" :loading="isLoading"
                                loadingText="Registering..." />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </LayoutAuth>
</template>

<script setup>

definePageMeta({
    title: 'Register',
    description: 'Register your account',
    layout: 'blank',
    middleware: 'guest'
})

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useToast } from '@/components/ui/toast/use-toast'
import axios from 'axios'
import { RegisterSchema } from '~/schema/register.schema';

const formSchema = toTypedSchema(RegisterSchema);
const router = useRouter();
const route = useRoute();
const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        phone: route.query.phone || '',
        district: '',
        district_name: '',
        thana: '',
        thana_name: '',
        institute: '',
        institute_name: '',
        batch: 'Others',
    },
});

const isLoading = ref(false);
const districts = ref([]);
const thanas = ref([]);
const schools = ref([]);
const thanaLoading = ref(false);

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

const hsc_batches = [
    'HSC 2027',
    'HSC 2026',
    'HSC 2025',
    'Others',
]

const handleDistrictChange = async (districtId) => {
    form.values.thana = '';
    form.values.thana_name = '';
    form.values.institute = '';
    form.values.institute_name = '';
    thanas.value = [];
    schools.value = [];

    if (districtId) {
        try {
            thanaLoading.value = true;

            const selectedDistrict = districts.value.find(d => d.name === districtId);

            const thanaRes = await axios.get(`https://oyster-app-nmb7x.ondigitalocean.app/api/location/thanas/${selectedDistrict.id}`);
            thanas.value = thanaRes.data.data;
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error fetching thanas',
                variant: 'destructive'
            });
        } finally {
            thanaLoading.value = false;
        }
    }
};

const handleThanaChange = async (thanaId) => {
    form.values.institute = '';
    form.values.institute_name = '';
    schools.value = [];

    if (thanaId) {
        try {
            thanaLoading.value = true;
            const selectedThana = thanas.value.find(t => t.name === thanaId);

            const { data } = await axios.get(`https://oyster-app-nmb7x.ondigitalocean.app/api/location/schools/${selectedThana.id}`);
            schools.value = data.data;
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error fetching schools',
                variant: 'destructive'
            });
        } finally {
            thanaLoading.value = false;
        }
    }
};



onMounted(async () => {
    try {
        const { data } = await axios.get('https://oyster-app-nmb7x.ondigitalocean.app/api/location/districts');
        districts.value = data.data;
    } catch (error) {
        console.error(error);
        toast({
            title: 'Error fetching districts',
            variant: 'destructive'
        });
    }
});
</script>
