import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Attendance } from '@/types/attendance';
import { useAttendanceStore } from '@/stores/attendanceStore';

export const WeeklyAttendance = () => {
    const { attendances } = useAttendanceStore();

    const getStatusColor = (status: string, checkIn: string | null, checkOut: string | null) => {
        if (status === "Late") return "warning";
        if (checkOut !== null) return "success";
        if (checkIn !== null) return "primary";
        return "primary";
    };

    const formatTime = (time: string | null) => {
        if (!time) return '-';
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const translateStatus = (status: string, checkIn: string | null, checkOut: string | null) => {
        if (status === "Late") return "Terlambat";
        if (status === "Present" && checkOut !== null) return "Pulang";
        if (status === "Present" && checkIn !== null) return "Masuk";
        return status;
    };

    const getStatusBadges = (record: Attendance) => {
        const badges = [];

        // Check-in badge with info color for on-time and warning for late
        if (record.check_in) {
            badges.push(
                <Badge 
                    key="check-in" 
                    className={`rounded-full bg-${record.status === "Late" ? "warning" : "info"}-100`}
                >
                    <BadgeText className={`text-${record.status === "Late" ? "warning" : "info"}-600`}>
                        {record.status === "Late" ? "Terlambat" : "Masuk"}
                    </BadgeText>
                </Badge>
            );
        }

        // Check-out badge if exists
        if (record.check_out) {
            badges.push(
                <Badge key="check-out" className="rounded-full bg-success-100">
                    <BadgeText className="text-success-600">
                        Pulang
                    </BadgeText>
                </Badge>
            );
        }

        return badges;
    };

    return (
        <View className="px-3">
            <HStack className="items-center justify-between mb-2">
                <Heading size="sm">
                    <Text>Riwayat Absensi</Text>
                </Heading>
                <Button variant="link" size="sm">
                    <ButtonText className="text-sm text-primary-500">Lihat Semua</ButtonText>
                </Button>
            </HStack>
            <View className="p-4 border rounded-lg backdrop-blur-md border-typography-800/20">
                <VStack space="xs">
                    {attendances.length > 0 ? (
                        attendances.map((record, index) => (
                            <View key={record.id}>
                                <HStack className="items-center justify-between py-2">
                                    <HStack space="sm" className="items-center">
                                        <View className="items-center justify-center w-8 h-8 border rounded-xl bg-background-light border-typography-100">
                                            <View className={`w-2 h-2 rounded-full bg-${getStatusColor(record.status, record.check_in, record.check_out)}-500`} />
                                        </View>
                                        <VStack>
                                            <Text className="font-medium text-typography-700">
                                                {formatDate(record.date)}
                                            </Text>
                                            <Text className="text-xs text-typography-500">
                                                {`${record.check_in ? formatTime(record.check_in) : ''}${record.check_in && record.check_out ? ' - ' : ''}${record.check_out ? formatTime(record.check_out) : ''}`}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <HStack space="xs">
                                        {getStatusBadges(record)}
                                    </HStack>
                                </HStack>
                                {index < attendances.length - 1 && (
                                    <View className="h-px bg-typography-100" />
                                )}
                            </View>
                        ))
                    ) : (
                        <View className="items-center justify-center py-8">
                            <Text className="text-sm text-typography-500">
                                Belum ada absensi minggu ini
                            </Text>
                        </View>
                    )}
                </VStack>
            </View>
        </View>
    );
};