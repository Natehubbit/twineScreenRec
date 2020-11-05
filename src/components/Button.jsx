import React from "react"
import { TouchableOpacity, View, StyleSheet } from "react-native"

const Button = ({ children, ...propsLeft }) => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity {...propsLeft}>{children}</TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  }
})

export default Button
