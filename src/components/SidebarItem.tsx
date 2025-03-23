"use client"

import type React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useTheme } from "../context/ThemeContext"

interface SidebarItemProps {
  label: string
  icon?: string
  onPress: () => void
  isActive?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, onPress, isActive = false }) => {
  const { colors } = useTheme()

  return (
    <TouchableOpacity style={[styles.container, isActive && { backgroundColor: colors.primary }]} onPress={onPress}>
      {icon && <Icon name={icon} size={20} color={colors.text} style={styles.icon} />}
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "400",
  },
})

export default SidebarItem

