import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Button, ButtonText } from '@/components/ui/button';
import { Clock, MapPin } from 'lucide-react-native';
import { VStack } from '@/components/ui/vstack';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { findNearestAgency } from '@/utils/location';
import { useState, useEffect } from 'react';
import { CameraModal } from './CameraModal';
import { useToast } from '@/components/ui/toast';

interface AttendanceStatusProps {
    onRecord: (photoUri: string, isCheckout?: boolean) => void;
    isLoading: boolean;
    isLocationEnabled: boolean;
    currentLocation: { latitude: number; longitude: number } | null;
}

interface LocationStatus {
    distance: number;
    isWithinRadius: boolean;
}

export const AttendanceStatus = ({ onRecord, isLoading, isLocationEnabled, currentLocation }: AttendanceStatusProps) => {
    const { currentSchedule, hasCheckedInToday, hasCheckedOutToday, settings, agencies, currentServerTime } = useAttendanceStore();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showCamera, setShowCamera] = useState(false);
    const toast = useToast();

    // Update local time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const hasAgencies = (): boolean => {
        return Array.isArray(agencies) && agencies.length > 0;
    };

    const getLocationStatus = (): LocationStatus | null => {
        if (!currentLocation || !settings?.allow_location_based) {
            return null;
        }

        if (settings.allow_location_based && !hasAgencies()) {
            return null;
        }

        const { distance, isWithinRadius } = findNearestAgency(
            currentLocation.latitude,
            currentLocation.longitude,
            agencies || [],
            parseFloat(settings.allowed_radius)
        );

        return { distance, isWithinRadius };
    };

    const locationStatus = getLocationStatus();
    const canRecord = isLocationEnabled &&
        (!settings?.allow_location_based ||
            (hasAgencies() && (locationStatus?.isWithinRadius ?? false)));

    const isWithinCheckoutTime = () => {
        if (!currentSchedule) return false;
        
        // Get end time from schedule
        const [hours, minutes] = currentSchedule.end_time.split(':');
        
        // Use the same time as displayed in header
        const now = currentTime;
        const todayEnd = new Date(now);
        todayEnd.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        console.log('Current Time:', now.toLocaleTimeString('id-ID'));
        console.log('End Time:', todayEnd.toLocaleTimeString('id-ID'));
        
        return now >= todayEnd;
    };

    const getLocationText = () => {
        if (!isLocationEnabled) return "Mencari lokasi...";
        if (!settings?.allow_location_based) return "Lokasi Siap";
        if (!hasAgencies()) return "Belum terdaftar instansi";
        if (!locationStatus) return "Menghitung jarak...";

        return locationStatus.isWithinRadius
            ? `Dalam Jangkauan (${locationStatus.distance.toFixed(0)}m)`
            : `Di Luar Jangkauan (${locationStatus.distance.toFixed(0)}m)`;
    };

    const getAttendanceStatus = () => {
        if (!currentSchedule) return "Libur";
        if (!hasCheckedInToday) return "Belum Absen";
        if (hasCheckedInToday && !isWithinCheckoutTime()) return "Sudah Masuk";
        if (hasCheckedInToday && isWithinCheckoutTime() && !hasCheckedOutToday) return "Waktunya Pulang";
        if (hasCheckedOutToday) return "Sudah Pulang";
        return "Belum Absen";
    };

    const getStatusColor = () => {
        if (!currentSchedule) return '#6b7280'; // gray color for holiday
        if (!hasCheckedInToday) return '#f59e0b';
        if (hasCheckedInToday && !isWithinCheckoutTime()) return '#22c55e'; // success green
        if (hasCheckedInToday && isWithinCheckoutTime() && !hasCheckedOutToday) return '#3b82f6'; // info blue
        if (hasCheckedOutToday) return '#22c55e';
        return '#f59e0b';
    };

    const formatTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const StatusIndicator = () => (
        <View 
            style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: getStatusColor()
            }}
        />
    );

    const isTimeInSync = (): boolean => {
        if (!currentServerTime) return true; 

        const serverTime = new Date(currentServerTime);
        const localTime = new Date();
        const timeDiff = Math.abs(serverTime.getTime() - localTime.getTime());

        return timeDiff <= 5 * 60 * 1000;
    };

    const isButtonDisabled = () => {
        if (!currentSchedule) return true; // Disable if no schedule
        if (!isTimeInSync()) return true;

        return !!(
            isLoading ||
            !canRecord ||
            (settings?.allow_location_based && !hasAgencies()) ||
            (hasCheckedInToday && !isWithinCheckoutTime()) ||
            hasCheckedOutToday
        );
    };

    const handleAttendancePress = () => {
        const isCheckout = hasCheckedInToday && isWithinCheckoutTime() && !hasCheckedOutToday;
        setShowCamera(true);
    };

    const handlePhotoCapture = async (photoUri: string) => {
        if (!currentLocation) return;
        const isCheckout = hasCheckedInToday && isWithinCheckoutTime() && !hasCheckedOutToday;
        onRecord(photoUri, isCheckout);
    };

    return (
        <View>
            <View className="px-3">
                <View className='p-4 border rounded-lg backdrop-blur-md border-typography-800/20'>
                    <VStack space="md">
                        <HStack className="justify-between">
                            <VStack space="xs" className="flex-1">
                                <Text className="text-sm text-typography-500">Status Hari Ini</Text>
                                <HStack space="sm" className="items-center">
                                    <StatusIndicator />
                                    <Text className={`font-medium ${!currentSchedule ? 'text-typography-500' : ''}`}>
                                        {getAttendanceStatus()}
                                    </Text>
                                </HStack>
                            </VStack>
                            <VStack space="xs" className="items-end flex-1">
                                <Text className="text-sm text-typography-500">Waktu Kerja</Text>
                                <HStack space="xs" className="items-center">
                                    <View className="items-center justify-center w-8 h-8">
                                        <Clock stroke="#6b7280" size={18} />
                                    </View>
                                    <Text className="font-medium">
                                        {currentSchedule 
                                            ? `${formatTime(currentSchedule.start_time)} - ${formatTime(currentSchedule.end_time)}`
                                            : 'Tidak ada jadwal'
                                        }
                                    </Text>
                                </HStack>
                            </VStack>
                        </HStack>

                        <View className="h-px bg-typography-100" />

                        <HStack space="sm" className="items-center">
                            <View className="items-center justify-center w-8 h-8">
                                <MapPin stroke="#6b7280" size={18} />
                            </View>
                            <VStack>
                                <Text className="text-sm text-typography-500">
                                    {getLocationText()}
                                </Text>
                                {settings?.allow_location_based && hasAgencies() ? (
                                    <Text className="text-xs text-typography-400">
                                        {`Radius yang diizinkan: ${settings.allowed_radius}m`}
                                    </Text>
                                ) : null}
                            </VStack>
                        </HStack>

                        <Button
                            size="lg"
                            variant="solid"
                            action="primary"
                            isDisabled={isButtonDisabled()}
                            onPress={handleAttendancePress}
                            className="w-full"
                        >
                            <ButtonText>
                                {!currentSchedule ? "Tidak Ada Jadwal Hari Ini" :
                                !isTimeInSync() ? "Waktu tidak sinkron dengan server" :
                                isLoading ? "Memproses..." :
                                !isLocationEnabled ? "Menunggu Lokasi" :
                                settings?.allow_location_based && !hasAgencies() ? "Belum Terdaftar Instansi" :
                                !canRecord ? "Lokasi Di Luar Jangkauan" :
                                hasCheckedOutToday ? "Sudah Pulang" :
                                hasCheckedInToday && isWithinCheckoutTime() ? "Absen Pulang" :
                                hasCheckedInToday ? "Sudah Masuk" : "Absen Masuk"}
                            </ButtonText>
                        </Button>
                    </VStack>
                </View>
            </View>
            <CameraModal
                isVisible={showCamera}
                onClose={() => setShowCamera(false)}
                onCapture={handlePhotoCapture}
            />
        </View>
    );
};