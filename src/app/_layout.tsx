import { colors } from "@/styles/colors";
import { Stack } from "expo-router";

import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";
import { StatusBar } from "expo-status-bar";
import Loading from "@/components/loading";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Rubik_600SemiBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });

  if (!fontsLoaded) {
    return <Loading/>
  }

  return (
    <>
    <StatusBar style="dark" backgroundColor="transparent"/>
      <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.gray[100] },
      }}
    />
    </>
    
  );
}
