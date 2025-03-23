"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useTheme } from "../context/ThemeContext"

interface CodeBlockProps {
  code: string
  language?: string
  showFullCode?: boolean
  onShowFullCode?: () => void
  onCopy?: () => void
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "cpp",
  showFullCode = false,
  onShowFullCode,
  onCopy,
}) => {
  const { colors } = useTheme()

  // Simple syntax highlighting for C++
  const highlightCpp = (code: string) => {
    const keywords = [
      "int",
      "void",
      "class",
      "public",
      "private",
      "using",
      "namespace",
      "std",
      "vector",
      "queue",
      "bool",
    ]
    const types = ["int", "bool", "void", "vector", "queue"]
    const comments = ["//"]

    const lines = code.split("\n")

    return lines.map((line, index) => {
      // Handle comments
      const commentIndex = line.indexOf("//")
      let commentPart = ""
      let codePart = line

      if (commentIndex !== -1) {
        commentPart = line.substring(commentIndex)
        codePart = line.substring(0, commentIndex)
      }

      // Process code part
      let processedLine = codePart
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "g")
        processedLine = processedLine.replace(regex, `<keyword>${keyword}</keyword>`)
      })

      types.forEach((type) => {
        const regex = new RegExp(`\\b${type}\\b`, "g")
        processedLine = processedLine.replace(regex, `<type>${type}</type>`)
      })

      // Add comment part back
      if (commentPart) {
        processedLine += `<comment>${commentPart}</comment>`
      }

      return (
        <Text key={index} style={styles.codeLine}>
          <Text style={styles.lineNumber}>{index + 1}</Text>
          {processedLine.split(/<(\w+)>(.*?)<\/\1>/g).map((part, i) => {
            if (i % 3 === 1) {
              // This is a tag name (keyword, type, comment)
              return null
            } else if (i % 3 === 2) {
              // This is content inside a tag
              const tagName = processedLine.split(/<(\w+)>(.*?)<\/\1>/g)[i - 1]
              if (tagName === "keyword") {
                return (
                  <Text key={i} style={{ color: "#CC7832" }}>
                    {part}
                  </Text>
                )
              } else if (tagName === "type") {
                return (
                  <Text key={i} style={{ color: "#A9B7C6" }}>
                    {part}
                  </Text>
                )
              } else if (tagName === "comment") {
                return (
                  <Text key={i} style={{ color: "#808080" }}>
                    {part}
                  </Text>
                )
              }
            }
            return (
              <Text key={i} style={{ color: colors.codeForeground }}>
                {part}
              </Text>
            )
          })}
        </Text>
      )
    })
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.codeBackground }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ScrollView style={styles.codeContainer} showsVerticalScrollIndicator={false}>
          {highlightCpp(code)}
        </ScrollView>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onCopy}>
          <Icon name="copy" size={16} color="#FFFFFF" />
          <Text style={styles.buttonText}>Copy</Text>
        </TouchableOpacity>

        {!showFullCode && (
          <TouchableOpacity style={styles.button} onPress={onShowFullCode}>
            <Text style={styles.buttonText}>Show Full Code</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 10,
    overflow: "hidden",
  },
  codeContainer: {
    padding: 12,
    maxHeight: 300,
  },
  codeLine: {
    fontFamily: "monospace",
    fontSize: 14,
    lineHeight: 20,
    paddingRight: 16,
  },
  lineNumber: {
    color: "#606366",
    marginRight: 10,
    textAlign: "right",
    width: 24,
    display: "flex",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonText: {
    color: "#FFFFFF",
    marginLeft: 4,
    fontSize: 14,
  },
})

export default CodeBlock

