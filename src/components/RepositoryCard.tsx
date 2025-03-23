"use client"

import type React from "react"
import { Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../context/ThemeContext"

interface RepositoryCardProps {
  name: string
  onPress: () => void
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ name, onPress }) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: colors.text }]}>{name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
})

export default RepositoryCard

