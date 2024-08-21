<template>
    
        <AppLoader v-if="isLoading" />
        <div class="space-y-6">
            <div class="flex flex-col gap-3">
                <Button variant="outline">
                    <a href="/login/google" class="flex items-center">
                        <Icon name="flat-color-icons:google" class="w-4 h-4 mr-2" />
                        Continue with Google
                    </a>
                </Button>
                <Button :variant="isEmail ? 'secondary' : 'outline'" @click="isEmail = !isEmail">
                    <Icon name="heroicons:at-symbol" class="w-4 h-4 mr-2" />
                    Continue with Email & Password

                </Button>
            </div>
            <Transition>
                <form @submit="onSubmit" v-if="isEmail">
                    <div class="space-y-6">
                        <FormField v-slot="{ componentField }" name="email">
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="example@example.com" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="password">
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*****" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <div class="flex flex-col gap-2 py-6">
                        <div class="flex flex-row items-center w-full gap-4">
                            <Button type="submit" class="w-full">
                                Continue
                            </Button>
                        </div>
                        <div class="flex flex-col gap-4 mt-3">
                            <hr />
                            <div class="mt-4 font-light text-center">
                                <p class="font-semibold cursor-pointer hover:text-gray-700"
                                    >
                                    Forget password?
                                </p>
                            </div>
                        </div>

                    </div>
                </form>
            </Transition>

        </div>

  
</template>

<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import {LoginSchema} from '~/schema/login.schema'

const { onOpen: forgetModal } = useForget()

const forgetPassword = () => {

    forgetModal()
    onClose()
}

const isEmail = ref(false)

const formSchema = toTypedSchema(LoginSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        email: '',
        password: '',
    }
})

const isLoading = ref(false)
const { toast } = useToast()
const user = useUser();
const assignUser = async () => {

    const data = await useRequestFetch()("/api/user");
    if (data) {
        user.value = data;
    }


    if (!data.name) {
        navigateTo('/edit')
    }
}

const onSubmit = form.handleSubmit(async () => {



    try {
        isLoading.value = true
        const { data, error } = await useAsyncData(() => $fetch('/api/auth/signin', {
            method: 'POST',
            body: (form.values)
        }))
        if (error.value) {
            return toast({
                title: error.value.statusCode.toString(),
                description: error.value.statusMessage,
                variant: 'destructive'
            })
        }
        await assignUser();
        return onClose()
    } catch (error) {
        return toast({
            title: error.toString(),
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})


</script>

<style lang="css" scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>