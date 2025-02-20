import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { LucideIcon } from 'lucide-react-native';
import { Pressable } from '@/components/ui/pressable';

interface ProfileFieldProps {
    label: string;
    value: string | null;
    icon?: LucideIcon;
}

export const ProfileField = ({ label, value, icon: Icon }: ProfileFieldProps) => (
    <Pressable className="active:opacity-80">
        <View className="p-4 border rounded-lg backdrop-blur-md border-typography-800/20">
            <HStack space="sm" className="items-center">
                {Icon && (
                    <View className="items-center justify-center w-8 h-8 rounded-xl">
                        <Icon stroke="#6b7280" size={18} />
                    </View>
                )}
                <Text className="text-xs font-medium text-typography-500">{label}</Text>
            </HStack>
            <Text numberOfLines={1} className="ml-10 font-semibold truncate text-typography-700">
                {value || '-'}
            </Text>
        </View>
    </Pressable>
);