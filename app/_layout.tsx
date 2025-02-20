import { Stack } from "expo-router";
import "@/global.css";
import { useThemeStore } from "@/stores/themeStore";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useStore } from "@/stores/rootStore";
import { useEffect, useState } from "react";
import { ToastProvider } from '@gluestack-ui/toast';
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const { theme } = useThemeStore();
  const checkAuth = useStore((state) => state.checkAuth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsChecking(false);
      }
    };

    initializeAuth();
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GluestackUIProvider mode={theme}>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ToastProvider>
    </GluestackUIProvider>
  );
}
