import { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types/user';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { getTimeComparison, formatWIBTime } from '@/utils/time';
import { useTimeStore } from '@/stores/timeStore';

interface WelcomeHeaderProps {
    user: User | null;
}

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const TIME_SYNC_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export const WelcomeHeader = ({ user }: WelcomeHeaderProps) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { serverTime, fetchServerTime } = useTimeStore();

    // Update local time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch server time every 10 seconds
    useEffect(() => {
        fetchServerTime();
        const serverTimer = setInterval(fetchServerTime, 10000);
        return () => clearInterval(serverTimer);
    }, []);

    const formatDate = (date: Date) => {
        return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
    };

    const TimeDisplay = () => {
        const isInSync = !serverTime ? true : Math.abs(
            new Date(serverTime).getTime() - currentTime.getTime()
        ) <= 5 * 60 * 1000; // 5 minutes tolerance

        return (
            <VStack space="xs">
                <HStack space="sm" className="items-center">
                    <Text className="text-sm text-typography-500">
                        {formatDate(currentTime)}
                    </Text>
                    <Text className="text-sm text-typography-500">•</Text>
                    <Text className={`text-sm font-medium ${isInSync ? 'text-typography-600' : 'text-error-500'}`}>
                        {currentTime.toLocaleTimeString('id-ID')}
                    </Text>
                </HStack>
                {!isInSync && serverTime && (
                    <Text className="text-xs text-error-500">
                        Server: {new Date(serverTime).toLocaleTimeString('id-ID')}
                    </Text>
                )}
            </VStack>
        );
    };

    const ProfileAvatar = () => (
        <Pressable 
            onPress={() => router.push('/(app)/profile')}
            className="active:opacity-80"
        >
            <View className="p-0.5 rounded-full bg-background-light shadow-sm">
                <Avatar 
                    size="md" 
                    className="border-2 border-primary-200"
                >
                    <AvatarFallbackText>{user?.name}</AvatarFallbackText>
                    {user?.avatar_url && (
                        <AvatarImage 
                            source={{ uri: user.avatar_url }}
                            className="rounded-full"
                        />
                    )}
                </Avatar>
            </View>
        </Pressable>
    );

    return (
        <View className="relative w-full">
            <View className="absolute inset-0 bg-gradient-to-b from-primary-100/20 via-background-light to-transparent" />
            <View className="px-3 py-4">
                <HStack space="md" className="items-start justify-between">
                    <VStack space="xs">
                        <Text className="text-sm font-medium text-primary-600">
                            Selamat datang,
                        </Text>
                        <Heading 
                            size="xl" 
                            className="font-bold tracking-wide text-typography-900"
                        >
                            {user?.name?.split(' ')[0] || 'User'}
                        </Heading>
                        <TimeDisplay />
                    </VStack>
                    <ProfileAvatar />
                </HStack>
            </View>
        </View>
    );
};