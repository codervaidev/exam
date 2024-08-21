<template>
    <LayoutAuth>
        <div class="grid max-w-sm gap-6 mx-auto">
            <div class="grid gap-2">
                <img src="/acs.png" alt="logo" class="h-16 mx-auto mb-10" />
                <h3 class="text-xl font-bold lg:hidden text-slate-800">
                    Second Timer <span class="text-orange-400">Grooming</span> Hub
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
                                    <Input type="tel" placeholder="01X-XXXX-XXXX" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>


                        <FormField v-slot="{ componentField }" name="district">
                            <FormItem>
                                <FormLabel>District</FormLabel>
                                <MultiSelect v-bind="componentField" :options="districts" :searchable="true"
                                    :close-on-select="true" @close="getFilterData" :show-labels="false"
                                    placeholder="Select District">
                                </MultiSelect>


                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="thana">
                            <FormItem>
                                <FormLabel>Thana</FormLabel>

                                <MultiSelect v-bind="componentField" :options="thanas" :searchable="true"
                                    :close-on-select="true" :show-labels="false" placeholder="Select Thanas">
                                </MultiSelect>

                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="institute">
                            <FormItem>
                                <FormLabel>Institute Name</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Institute name" v-bind="componentField" />
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
import MultiSelect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.ssr.css'
import axios from 'axios'
import { RegisterSchema } from '~/schema/register.schema';

const formSchema = toTypedSchema(RegisterSchema);

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        phone: '',
        district: '',
        thana: '',
        institute: '',
        batch: 'Others',
    },
});

const isLoading = ref(false);
const router = useRouter();
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
    'HSC 2024',
    'HSC 2025',
    'HSC 2026',
    'HSC 2027'
]

const districts = ref([])
const thanas = ref([])



watch(form.values, (n) => {
    if (n.district) {
        getFilterData()
    }
})
const thanaLoading = ref(false)
const getFilterData = async () => {
    try {
        thanaLoading.value = true
        const { data } = await axios('https://collegeinfobe-production.up.railway.app/api/colleges/filters', {
            params: {
                district: form.values.district,
            }
        })

        if (data.districts.length > 0) districts.value = data.districts
        thanas.value = data.thanas
        thanaLoading.value = false
    } catch (error) {
        console.log(error)
        thanaLoading.value = false
    }
}

onMounted(() => {
    getFilterData()
})
</script>
