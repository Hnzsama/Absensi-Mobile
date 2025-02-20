// utils/theme.ts
import { useThemeStore } from "@/stores/themeStore";

type ThemeStyles = {
    light: string;
    dark: string;
};

export function cn(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export function useThemeColor(styles: ThemeStyles) {
    const { theme } = useThemeStore();
    return styles[theme];
}