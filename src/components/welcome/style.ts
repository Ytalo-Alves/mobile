import { StyleSheet } from "react-native";
import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";

export const s = StyleSheet.create({
  logo: {
    width: 48,
    height: 48,
    marginBottom: 28,
    marginTop: 24,
  },

  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.gray[600]
  },

  subtitle: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.gray[500],
    marginTop: 12,
  }
})