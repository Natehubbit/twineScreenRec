import React from "react"
import { View, StyleSheet } from "react-native"

const Video = () => {
  return (
    <View>
      <div style={{ ...styles.videoContainer }}></div>
    </View>
  )
}

const styles = StyleSheet.create({
  videoContainer: {
    height: 100,
    width: "80%",
    marginTop: "10%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green"
  }
})

export default Video
