import { Stack } from "expo-router";
import KeyboardDismissWrapper from "@/components/util/KeyboardWrapper";

export default function AuthLayout() {
  return (
    <KeyboardDismissWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
    </KeyboardDismissWrapper>
  );
}
