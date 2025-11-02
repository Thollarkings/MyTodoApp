import "../assets/styles/global.css";
// app/_layout.tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { AppThemeProvider } from "../src/contexts/ThemeContext";
import { Alert } from "react-native";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  Alert.alert("Convex URL Missing", "EXPO_PUBLIC_CONVEX_URL is not set in your environment variables.");
}

const convex = new ConvexReactClient(convexUrl!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <AppThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="add" options={{ title: "Add Task" }} />
          <Stack.Screen name="edit" options={{ title: "Edit Task" }} />
        </Stack>
      </AppThemeProvider>
    </ConvexProvider>
  );
}