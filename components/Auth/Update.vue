<template>
    <AppModal :isOpen="isOpen" title="Select your t-shirt size!"
        description="Please update your information to continue" @onClose="onClose" v-if="isOpen">
        <form @submit="updateProfile">
            <div class="space-y-6">





                <FormField v-slot="{ componentField }" name="tshirt">
                    <FormItem>
                        <FormLabel>T-shirt Size</FormLabel>
                        <Select v-bind="componentField">
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select T-shirt Size" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="S">Small (S)</SelectItem>
                                    <SelectItem value="M">Medium (M)</SelectItem>
                                    <SelectItem value="L">Large (L)</SelectItem>
                                    <SelectItem value="XL">Extra Large (XL)</SelectItem>
                                    <SelectItem value="XXL">Double Extra Large (XXL)</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="address">
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Textarea type="text" placeholder="Your full address" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <AppButton label="Update Profile" loadingLabel="Updating..." :loading="isLoading" class="w-full"
                    type="submit" />

            </div>
        </form>

    </AppModal>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { UpdateSchema } from '~/schema/login.schema'
const { isOpen, onClose } = useUpdate()

const formSchema = toTypedSchema(UpdateSchema)
const user = useUser();
const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        address: user.value.address,
        tshirt: user.value.tshirt || 'S',
    }
})


const isLoading = ref(false)
const { toast } = useToast()

const assignUser = async () => {

    const data = await useRequestFetch()("/api/user");
    if (data) {
        user.value = data;
    }
}

const updateProfile = form.handleSubmit(async () => {
    try {
        isLoading.value = true
        const data = await $fetch('/api/auth/update', {
            method: 'POST',
            body: form.values
        })

        if (data) {
            await assignUser();
            return onClose()
        }


    } catch (error) {

        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive'
        })

    } finally {
        isLoading.value = false
    }
})

</script>
