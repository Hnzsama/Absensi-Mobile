import { useEffect, useState, useCallback } from 'react';
import { ScrollView, RefreshControl, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { useStore } from '@/stores/rootStore';
import { View } from '@/components/ui/view';
import { VStack } from '@/components/ui/vstack';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { WelcomeHeader } from './components/home/WelcomeHeader';
import { LocationMap } from './components/home/LocationMap';
import { WeeklyAttendance } from './components/home/WeeklyAttendance';
import { AttendanceStatus } from './components/home/AttendanceStatus';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { AttendanceForm } from '@/types/attendance';
import { attendanceService } from '@/services/api/resource/attendance';
import { Toast, ToastTitle, ToastDescription, useToast } from '@/components/ui/toast';
import { Icon } from '@/components/ui/icon';
import { CheckCircleIcon, AlertCircleIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { router } from 'expo-router';

export default function HomeScreen() {
    const toast = useToast();
    const user = useStore((state) => state.user);
    const { fetchAttendanceData, settings } = useAttendanceStore();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const isAuthenticated = useStore((state) => state.isAuthenticated);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            }
        })();
    }, []);

    useEffect(() => {
        if (user?.student) {
            fetchAttendanceData('App\\Models\\Student', user.student.id);
        } else if (user?.teacher) {
            fetchAttendanceData('App\\Models\\Teacher', user.teacher.id);
        }
    }, [user]);

    const showToast = (type: 'success' | 'error', message: string) => {
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

    const handleAttendance = async (photoUri: string, isCheckout: boolean = false) => {
        if (!location || !user) return;

        setIsLoading(true);
        try {
            const deviceInfo = await Device.deviceName || 'Unknown Device';
            
            // Convert current time to WIB (UTC+7)
            const now = new Date();
            const wibDate = new Date(now.getTime() + (7 * 60 * 60 * 1000));
            const formattedDate = wibDate.toISOString().split('T')[0];

            const form: AttendanceForm = {
                attendable_type: user.student ? 'App\\Models\\Student' : 'App\\Models\\Teacher',
                attendable_id: user.student?.id || user.teacher?.id || '',
                date: formattedDate, // Use WIB date
                location_latitude: settings?.allow_location_based ? location.coords.latitude.toString() : null,
                location_longitude: settings?.allow_location_based ? location.coords.longitude.toString() : null,
                device_info: deviceInfo,
                photo_path: photoUri,
                notes: null
            };

            console.log('Submitting attendance:', { isCheckout, form });

            await attendanceService.storeAttendance(form);
            
            showToast(
                'success', 
                `Berhasil melakukan absen ${isCheckout ? 'pulang' : 'masuk'} pada ${wibDate.toLocaleTimeString('id-ID')}`
            );

            // Refresh attendance data
            if (user.student) {
                await fetchAttendanceData('App\\Models\\Student', user.student.id);
            } else if (user.teacher) {
                await fetchAttendanceData('App\\Models\\Teacher', user.teacher.id);
            }
        } catch (error: any) {
            console.error('Attendance submission failed:', error);
            showToast(
                'error', 
                error.data?.error || error.message || 'Terjadi kesalahan saat melakukan absensi'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const refreshData = async () => {
        setRefreshing(true);
        try {
            // Refresh location
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status === 'granted') {
                const newLocation = await Location.getCurrentPositionAsync({});
                setLocation(newLocation);
            }

            // Refresh attendance data
            if (user?.student) {
                await fetchAttendanceData('App\\Models\\Student', user.student.id);
            } else if (user?.teacher) {
                await fetchAttendanceData('App\\Models\\Teacher', user.teacher.id);
            }
        } finally {
            setRefreshing(false);
        }
    };

    const currentLocation = location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    } : null;

    // Check authentication on component mount
    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated]);

    console.log(isAuthenticated)

    return (
        <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={refreshData}
                        tintColor="#0284c7"
                        colors={['#0284c7']}
                    />
                }
            >
                <VStack space="lg">
                    <WelcomeHeader user={user} />
                    <AttendanceStatus
                        onRecord={handleAttendance}
                        isLoading={isLoading}
                        isLocationEnabled={!!location}
                        currentLocation={currentLocation}
                    />
                    <View className='px-3'>
                        <LocationMap location={location} />
                    </View>
                    <WeeklyAttendance />
                </VStack>
            </ScrollView>
        </SafeAreaView>
    );
}