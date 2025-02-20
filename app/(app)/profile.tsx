import { ScrollView } from 'react-native';
import { useStore } from '@/stores/rootStore';
import { VStack } from '@/components/ui/vstack';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { View } from '@/components/ui/view';
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { LogOut } from "lucide-react-native";
import { router } from "expo-router";
import { LogoutAlert } from '@/components/LogoutAlert';
import { useState } from 'react';
import { ProfileHeader } from './components/profile/ProfileHeader';
import { PersonalInfo } from './components/profile/PersonalInfo';
import { RoleInfo } from './components/profile/RoleInfo';
import { Toast, ToastTitle, ToastDescription, useToast } from '@/components/ui/toast';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { AlertCircleIcon } from '@/components/ui/icon';

export default function ProfileScreen() {
    const user = useStore((state) => state.user);
    const isTeacher = user?.roles?.[0]?.name === 'teacher';
    const profileData = isTeacher ? user?.teacher : user?.student;
    const toast = useToast();

    const logout = useStore((state) => state.logout);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLogoutPress = () => {
        setShowLogoutDialog(true);
    };

    const showNotification = (message: string) => {
        const id = Math.random().toString();
        toast.show({
            id,
            placement: 'top',
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                    <Toast
                        action="error"
                        variant="outline"
                        nativeID={uniqueToastId}
                        className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
                    >
                        <HStack space="md">
                            <Icon
                                as={AlertCircleIcon}
                                className="stroke-error-500 mt-0.5"
                            />
                            <VStack space="xs">
                                <ToastTitle className="font-semibold text-error-500">
                                    Gagal!
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

    const handleLogout = async () => {
        try {
            setShowLogoutDialog(false);
            await logout();
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Logout failed:', error);
            showNotification(error instanceof Error ? error.message : "Terjadi kesalahan saat logout");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView>
                <VStack space="xl" className="p-2">
                    <ProfileHeader user={user} />
                    <PersonalInfo
                        profileData={profileData}
                        isTeacher={isTeacher}
                    />
                    <RoleInfo
                        profileData={profileData}
                        isTeacher={isTeacher}
                    />
                    <View className="p-3">
                        <Button
                            size="lg"
                            variant="outline"
                            action="negative"
                            onPress={handleLogoutPress}
                            className="w-full rounded-lg border-error-500"
                        >
                            <ButtonIcon as={LogOut} className="mr-2" />
                            <ButtonText>Logout</ButtonText>
                        </Button>
                    </View>
                </VStack>
            </ScrollView>

            <LogoutAlert
                isOpen={showLogoutDialog}
                onClose={() => setShowLogoutDialog(false)}
                onLogout={handleLogout}
            />
        </SafeAreaView>
    );
}