import { View } from '@/components/ui/view';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { ProfileField } from './ProfileField';
import { formatDate } from '@/utils/date';
import { Student, Teacher } from '@/types/user';
import {
    BookOpen,
    GraduationCap,
    School,
    Building2,
    Calendar,
    Award,
    Flag,
    Clock,
    AlertCircle,
    ClipboardList,
    BookOpenCheck
} from 'lucide-react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonIcon } from '@/components/ui/button';

interface RoleInfoProps {
    profileData: Student | Teacher | null | undefined;
    isTeacher: boolean;
}

export const RoleInfo = ({ profileData, isTeacher }: RoleInfoProps) => (
    <View className="w-full bg-background-light dark:bg-background-dark backdrop-blur-md">
        <View className="px-2 py-3">
            <HStack space="md" className="items-center">
                <Button
                    variant="solid"
                    size="md"
                    className="items-center justify-center w-12 h-12 p-0 rounded-2xl bg-background-50"
                >
                    <ButtonIcon
                        as={isTeacher ? ClipboardList : BookOpenCheck} 
                        size="lg"
                        className="text-typography-500" 
                    />
                </Button>
                <Heading size="sm" className="font-semibold">
                    {isTeacher ? 'Informasi Mengajar' : 'Informasi Akademik'}
                </Heading>
            </HStack>
        </View>

        <View className="p-3">
            <View className="grid grid-cols-2 gap-3">
                {isTeacher ? (
                    <>
                        <View className="col-span-2">
                            <ProfileField
                                label="Jabatan"
                                value={(profileData as Teacher)?.position}
                                icon={Building2}
                            />
                        </View>
                        <ProfileField
                            label="Mata Pelajaran"
                            value={(profileData as Teacher)?.subject}
                            icon={BookOpen}
                        />
                        <ProfileField
                            label="Pendidikan"
                            value={`${(profileData as Teacher)?.highest_education}`}
                            icon={GraduationCap}
                        />
                        <ProfileField
                            label="Jurusan"
                            value={(profileData as Teacher)?.major}
                            icon={Award}
                        />
                        <ProfileField
                            label="Universitas"
                            value={(profileData as Teacher)?.university}
                            icon={School}
                        />
                        <ProfileField
                            label="Tahun Mulai"
                            value={(profileData as Teacher)?.year_started?.toString()}
                            icon={Calendar}
                        />
                    </>
                ) : (
                    <>
                        <View className="col-span-2">
                            <ProfileField
                                label="Status"
                                value={(profileData as Student)?.status}
                                icon={Award}
                            />
                        </View>
                        <View className="col-span-2">
                            <ProfileField
                                label="Tanggal Masuk"
                                value={formatDate((profileData as Student)?.enrollment_date)}
                                icon={Clock}
                            />
                        </View>
                        <View className="col-span-2">
                            <ProfileField
                                label="Poin Pelanggaran"
                                value={(profileData as Student)?.violation_points?.toString()}
                                icon={AlertCircle}
                            />
                        </View>
                    </>
                )}
            </View>
        </View>
    </View>
);