<template>
    <LayoutAuth>
        <div class="grid items-center max-w-sm min-h-screen gap-6 mx-auto">
            <div class="grid gap-2 ">
                <img src="/logo.png" alt="logo" class="h-16 mx-auto mb-10" />
                <h3 class="text-xl font-bold lg:hidden text-slate-800">
                    <span class="text-yellow-500">ACS</span> Future School
                </h3>
                <h1 class="hidden text-2xl font-semibold tracking-tight lg:block">
                    Login
                </h1>
                <p class="text-sm text-muted-foreground">
                    Please login to continue.
                </p>
                <form @submit.prevent="onSubmit">
                    <div class="space-y-6">
                        <FormField v-slot="{ componentField }" name="phone">
                            <FormItem>
                                <Label>Phone Number</Label>
                                <FormControl>
                                    <Input type="tel" placeholder="01X-XXXX-XXXX" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>

                    <div class="flex flex-col gap-2 py-6">
                        <div class="flex flex-row items-center w-full gap-4">
                            <AppButton type="submit" class="w-full" label="Continue" :loading="isLoading"
                                loadingText="Please wait..." />


                        </div>
                    </div>
                </form>
            </div>
        </div>
    </LayoutAuth>
</template>

<script setup>

definePageMeta({
    title: 'Login',
    description: 'Login to your account',
    layout: 'blank',
    middleware: 'guest'
})
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import { LoginSchema } from '~/schema/login.schema'


const formSchema = toTypedSchema(LoginSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        phone: ''
    }
})
const isLoading = ref(false);

const user = useUser();
const assignUser = async () => {

    const data = await useRequestFetch()("/api/user");
    if (data) {
        user.value = data;
    }
}
const onSubmit = form.handleSubmit(async () => {
    try {
        isLoading.value = true;
        let phoneValue = form.values.phone.replace(/[^0-9]/g, '');

        const data = await $fetch('/api/auth/signin', {
            method: 'POST',
            body: { phone: phoneValue }
        })

        if (!data) {
            return navigateTo('/register?phone=' + phoneValue)
        }

        // Simulate user assignment and navigation
        await assignUser();
        return navigateTo('/')
    } catch (error) {
        // toast({
        //     title: error.toString(),
        //     variant: 'destructive'
        // });
        return navigateTo('/register?phone=' + form.values.phone)
    } finally {
        isLoading.value = false;
    }
});


</script>
