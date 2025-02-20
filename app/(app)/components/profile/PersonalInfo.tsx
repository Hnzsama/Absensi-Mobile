import { VStack } from '@/components/ui/vstack';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { ProfileField } from './ProfileField';
import { formatDate } from '@/utils/date';
import { Student, Teacher } from '@/types/user';
import { User2, Phone, MapPin, Calendar, Heart, UserCircle2 } from 'lucide-react-native';
import { View } from '@/components/ui/view';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonIcon } from '@/components/ui/button';

interface PersonalInfoProps {
    profileData: Student | Teacher | null | undefined;
    isTeacher: boolean;
}

export const PersonalInfo = ({ profileData, isTeacher }: PersonalInfoProps) => {
    const isTeacherProfile = (profile: any): profile is Teacher => {
        return 'nip' in profile;
    };

    const isStudentProfile = (profile: any): profile is Student => {
        return 'nis' in profile;
    };

    if (!profileData) {
        return null;
    }

    return (
        <View className="w-full backdrop-blur-md">
            <View className="px-2 py-3">
                <HStack space="md" className="items-center">
                    <Button
                        variant="solid"
                        size="md"
                        className="items-center justify-center w-12 h-12 p-0 rounded-2xl bg-background-50"
                    >
                        <ButtonIcon 
                            as={UserCircle2} 
                            size="lg" 
                            className="text-typography-500" 
                        />
                    </Button>
                    <Heading size="sm" className="font-semibold">
                        Informasi Pribadi
                    </Heading>
                </HStack>
            </View>

            <View className="p-3">
                <View className="grid grid-cols-2 gap-3">
                    <View className="col-span-2">
                        <ProfileField
                            label="Nama Lengkap"
                            value={profileData.name}
                            icon={User2}
                        />
                    </View>
                    <View className="col-span-2">
                        <ProfileField
                            label={isTeacher ? "NIP" : "NIS"}
                            value={
                                isTeacherProfile(profileData)
                                    ? profileData.nip
                                    : isStudentProfile(profileData)
                                        ? profileData.nis
                                        : ""
                            }
                            icon={Heart}
                        />
                    </View>
                    <View className="col-span-2">
                        <ProfileField
                            label="Jenis Kelamin"
                            value={profileData.gender}
                            icon={UserCircle2}
                        />
                    </View>
                    <View className="col-span-2">
                        <ProfileField
                            label="Tanggal Lahir"
                            value={`${profileData.place_of_birth}, ${formatDate(profileData.date_of_birth)}`}
                            icon={Calendar}
                        />
                    </View>
                    <View className="col-span-2">
                        <ProfileField
                            label="Telepon"
                            value={profileData.phone}
                            icon={Phone}
                        />
                    </View>
                    <View className="col-span-2">
                        <ProfileField
                            label="Alamat"
                            value={profileData.address}
                            icon={MapPin}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};
