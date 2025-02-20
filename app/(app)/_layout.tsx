import { Redirect, Tabs } from "expo-router";
import { useStore } from "@/stores/rootStore";
import { Home, User } from "lucide-react-native";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { View } from "@/components/ui/view";
import { useThemeStore } from "@/stores/themeStore";

export default function AppLayout() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const { theme } = useThemeStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? '#ffffff' : '#1a1a1a',
            borderTopWidth: 1,
            paddingBottom: 10,
            paddingTop: 10,
            height: 60,
          },
          tabBarActiveTintColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          tabBarInactiveTintColor: theme === 'dark' ? '#94a3b8' : '#64748b',
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
      <ThemeSwitcher />
    </View>
  );
}
