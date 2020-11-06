// eslint-disable-next-line
import React from 'react'
import { TouchableOpacity, View, StyleSheet, TouchableOpacityProps } from 'react-native'

export interface ButtonProps extends TouchableOpacityProps {}

const Button:React.FC<ButtonProps> = ({ children, ...propsLeft }) => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity  {...propsLeft}>{children}</TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10
  }
})

export default Button
