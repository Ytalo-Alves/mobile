import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";

export const s = StyleSheet.create({
  container: {
    maxHeight: 36,
    position: "absolute",
    zIndex: 1,
    top: 64
  },
  content: {
    gap: 8,
    paddingHorizontal: 24
  }
})