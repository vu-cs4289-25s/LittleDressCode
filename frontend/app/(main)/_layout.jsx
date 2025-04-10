import { Stack } from "expo-router";
import KeyboardDismissWrapper from "@/components/util/KeyboardWrapper";

export default function MainLayout() {
  return (
    <KeyboardDismissWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </KeyboardDismissWrapper>
  );
}
