import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Badge, BadgeText } from '@/components/ui/badge';
import { User } from '@/types/user';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

interface ProfileHeaderProps {
    user: User | null;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    const isTeacher = user?.roles?.[0]?.name === 'teacher';

    return (
        <View className="w-full overflow-hidden rounded-3xl bg-background-light dark:bg-background-dark backdrop-blur-lg">
            <VStack space="xl" className="items-center px-6 py-2">
                <View className="p-1.5 rounded-full bg-background-50/80 shadow-lg">
                    <View className="p-0.5 rounded-full border-2 border-background-light/90 dark:border-background-dark/90">
                        <Avatar size="2xl" className="border-2 border-background-100/20">
                            <AvatarFallbackText>{user?.name}</AvatarFallbackText>
                            {user?.avatar_url && <AvatarImage source={{ uri: user.avatar_url }} />}
                        </Avatar>
                    </View>
                </View>

                <VStack space="md" className="items-center w-full">
                    <VStack space="xs" className="items-center">
                        <Heading size="lg" className="font-bold tracking-wide text-center">
                            {user?.name}
                        </Heading>
                        <Text className="text-sm text-center text-typography-500/90">{user?.email}</Text>
                    </VStack>
                    
                    <Badge 
                        variant="solid" 
                        className="px-8 py-2 shadow-sm rounded-2xl bg-background-900"
                    >
                        <BadgeText className="font-semibold text-typography-100">
                            {isTeacher ? 'Guru' : 'Siswa'}
                        </BadgeText>
                    </Badge>
                </VStack>
            </VStack>
        </View>
    );
};
