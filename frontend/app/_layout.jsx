import { Stack } from 'expo-router/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider, useSelector } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from '@/store';

// Persist Redux state
const persistor = persistStore(store);

// Authentication selector (Assumes Redux is storing auth state)
const AuthCheck = () => {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated); // Adjust based on your Redux store

  return (
    <SafeAreaProvider>
      <Stack>
        {isAuthenticated ? (
          // If logged in, go to main tabs
          <Stack.Screen
            name="(main)/(tabs)"
            options={{ headerShown: false }}
          />
        ) : (
          // If not logged in, go to auth stack
          <Stack.Screen
            name="(auth)/welcome"
            options={{ headerShown: false }}
          />
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