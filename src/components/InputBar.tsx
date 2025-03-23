"use client"

import type React from "react"
import { useState } from "react"
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useTheme } from "../context/ThemeContext"

interface InputBarProps {
  onSend: (text: string) => void
  placeholder?: string
}

const InputBar: React.FC<InputBarProps> = ({ onSend, placeholder = "Ask anything" }) => {
  const [text, setText] = useState("")
  const { colors } = useTheme()

  const handleSend = () => {
    if (text.trim()) {
      onSend(text)
      setText("")
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.inputBackground }]}>
      <TouchableOpacity style={styles.button}>
        <Icon name="plus" size={20} color="#999" />
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={text}
        onChangeText={setText}
        multiline
      />

      <View style={styles.rightButtons}>
        <TouchableOpacity style={styles.button}>
          <Icon name="search" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Icon name="help-circle" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Icon name="send" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  button: {
    padding: 8,
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  sendButton: {
    padding: 8,
  },
})

export default InputBar

