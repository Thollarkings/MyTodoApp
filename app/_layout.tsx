import "../assets/styles/global.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { AppThemeProvider } from "../src/contexts/ThemeContext";
import { Text } from "react-native";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

let convex;
if (convexUrl) {
  convex = new ConvexReactClient(convexUrl, {
    unsavedChangesWarning: false,
  });
}

export default function RootLayout() {
  if (!convex) {
    return (
      <Text>
        EXPO_PUBLIC_CONVEX_URL is not set. Please set it in your environment.
      </Text>
    );
  }
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