// frontend/app/_layout.jsx
import { Stack } from "expo-router/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider, useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "@/store";

// Persist Redux state
const persistor = persistStore(store);

// Authentication selector
const AuthCheck = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // Adjust path if needed

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          // If logged in, go to main tabs
          <Stack.Screen name="(main)/(tabs)" options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen
              name="(auth)/welcome"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/login" // Add the login screen route
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack>
      <Toast />
    </SafeAreaProvider>
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthCheck />
      </PersistGate>
    </Provider>
  );
}
