import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { useStore } from "@/stores/rootStore";

export default function AuthLayout() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
