import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useStore } from "@/stores/rootStore";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Toast, ToastTitle, ToastDescription, useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LinkText } from "@/components/ui/link";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlLabel,
    FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { AlertTriangle, EyeIcon, EyeOffIcon } from "lucide-react-native";
import { Icon, CheckCircleIcon, AlertCircleIcon } from "@/components/ui/icon";

const loginSchema = z.object({
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const login = useStore((state) => state.login);

    const showNotification = (type: 'success' | 'error', message: string) => {
        const id = Math.random().toString();
        toast.show({
            id,
            placement: 'top',
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                    <Toast
                        action={type}
                        variant="outline"
                        nativeID={uniqueToastId}
                        className={`p-4 gap-6 border-${type === 'success' ? 'success' : 'error'}-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between`}
                    >
                        <HStack space="md">
                            <Icon
                                as={type === 'success' ? CheckCircleIcon : AlertCircleIcon}
                                className={`stroke-${type === 'success' ? 'success' : 'error'}-500 mt-0.5`}
                            />
                            <VStack space="xs">
                                <ToastTitle className={`font-semibold text-${type === 'success' ? 'success' : 'error'}-500`}>
                                    {type === 'success' ? 'Berhasil!' : 'Gagal!'}
                                </ToastTitle>
                                <ToastDescription size="sm">
                                    {message}
                                </ToastDescription>
                            </VStack>
                        </HStack>
                    </Toast>
                );
            },
        });
    };

    const token = useStore((state) => state.token);
    const user = useStore((state) => state.user);

    const onSubmit = async (data: LoginSchemaType) => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await login(data.email, data.password);
            showNotification('success', 'Login berhasil! Selamat datang kembali.');
            router.replace('/(app)/home');
        } catch (error: any) {
            showNotification('error', error.message || 'Login gagal! Silakan periksa kembali email dan password Anda.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <VStack className="justify-center flex-1 p-6" space="xl">
                <VStack space="md" className="items-center mb-6">
                    <Heading size="3xl">Selamat Datang</Heading>
                    <Text>Silakan masuk untuk melanjutkan</Text>
                </VStack>

                <VStack space="xl">
                    <FormControl isInvalid={!!errors.email}>
                        <FormControlLabel>
                            <FormControlLabelText>Email</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <Input>
                                    <InputField
                                        placeholder="Masukkan email Anda"
                                        value={value}
                                        onChangeText={onChange}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </Input>
                            )}
                        />
                        {errors.email && (
                            <FormControlError>
                                <FormControlErrorIcon as={AlertTriangle} />
                                <FormControlErrorText>{errors.email.message}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                        <FormControlLabel>
                            <FormControlLabelText>Password</FormControlLabelText>
                        </FormControlLabel>
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value } }) => (
                                <Input>
                                    <InputField
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Masukkan password Anda"
                                        value={value}
                                        onChangeText={onChange}
                                        secureTextEntry={!showPassword}
                                    />
                                    <InputSlot onPress={() => setShowPassword(!showPassword)} className="pr-3">
                                        <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                                    </InputSlot>
                                </Input>
                            )}
                        />
                        {errors.password && (
                            <FormControlError>
                                <FormControlErrorIcon as={AlertTriangle} />
                                <FormControlErrorText>{errors.password.message}</FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>
                </VStack>

                <VStack space="md" className="mt-6">
                    <Button
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        <ButtonText>{isSubmitting ? "Sedang masuk..." : "Masuk"}</ButtonText>
                    </Button>
                </VStack>
            </VStack>
        </SafeAreaView>
    );
}