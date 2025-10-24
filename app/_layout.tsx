import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* First screen = Login */}
      <Stack.Screen name="index" />

      {/* Tab layout (hidden until login navigates here) */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
