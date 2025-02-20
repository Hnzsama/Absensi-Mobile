import { View } from '@/components/ui/view';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react-native';
import { useThemeStore } from '@/stores/themeStore';

export const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <View className="absolute z-50 bottom-20 right-4">
            <Button
                className={`w-12 h-12 rounded-full items-center justify-center shadow-lg ${
                    theme === 'dark' ? 'bg-background-light' : 'bg-background-dark'
                }`}
                onPress={toggleTheme}
            >
                {theme === 'dark' ? (
                    <Sun stroke="#1e293b" size={22} />
                ) : (
                    <Moon stroke="#ffffff" size={22} />
                )}
            </Button>
        </View>
    );
};
