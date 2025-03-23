import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../context/ThemeContext";

interface InputBarProps {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const InputBar = ({
  onSend,
  placeholder = "Message GitGPT...",
  disabled = false,
}: InputBarProps) => {
  const [text, setText] = useState("");
  const { colors } = useTheme();

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text);
      setText("");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, opacity: disabled ? 0.7 : 1 },
      ]}
    >
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#666"
        style={[styles.input, { color: colors.text }]}
        multiline
        editable={!disabled}
      />
      <TouchableOpacity
        onPress={handleSend}
        style={[
          styles.sendButton,
          {
            backgroundColor: colors.accent,
            opacity: disabled || !text.trim() ? 0.5 : 1,
          },
        ]}
        disabled={disabled || !text.trim()}
      >
        <Icon
          name="send"
          size={18}
          color={text.trim() ? "#FFFFFF" : colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});

export default InputBar;
