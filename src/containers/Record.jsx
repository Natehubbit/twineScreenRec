import React, { Component, useRef, useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import Button from "../components/Button"
import RecordingService from '../services/RecordingService';

//Button components for screen recorder
const RecordButton = (props) => {
  const Icon = <View style={[styles.recordIcon]} />
  return <Button {...props}>{Icon}</Button>
}

const StopButton = (props) => {
  const Icon = (
    <View style={[styles.recordIcon]}>
      <View style={[styles.square]} />
    </View>
  )
  return <Button {...props}>{Icon}</Button>
}

const UploadButton = (props) => {
  return (
    <Button {...props}>
      <Image style={[styles.icon]} source={require("../assets/image.png")} />
    </Button>
  )
}

const RecordScreenButton = (props) => {
  return (
    <Button {...props}>
      <Image
        style={[styles.icon]}
        source={require("../assets/monitor.png")}
      />
    </Button>
  )
}

const AcceptButton = (props) => {
  return (
    <Button {...props}>
      <Image 
        style={[styles.icon,styles.solid,{tintColor:'#fff'}]} 
        source={require('../assets/check.png')} />
    </Button>
  )
}

const DiscardButton = (props) => {
  return (
    <Button {...props}>
      <Image 
        style={[styles.icon,styles.bordered]} 
        source={require('../assets/cross.png')} />
    </Button>
  )
} 


// Record screen container
const Record = () => {
  const [recording, setRecording] = useState(false)
  const [paused, setPaused] = useState(false)
  
  const onRecord = async () => {
    setRecording(true)
    setPaused(false)
    const success = await RecordingService.startRecording()
    if(!success){
      setRecording(false)
      setPaused(false)
    }
  }

  const onStopRecord = () => {
    setRecording(false)
    setPaused(false)
    RecordingService.stopRecording()
  }

  const onPause = () => {
    setPaused(true)
    setRecording(false)
    RecordingService.pauseRecording()
  }

  const onAccept = () => {
    setRecording(false)
    setPaused(false)
    RecordingService.downloadVideo()
  }

  const renderPausedBtns = () => {
    return (
      <>
        <DiscardButton onPress={onStopRecord}/>
        <StopButton onPress={onRecord} />
        <AcceptButton onPress={onAccept}/>
      </>
    )
  }

  const renderDefaultBtns = () => {
    return (
      <>
        <RecordScreenButton onPress={onRecord} />
        <RecordButton onPress={recording?onPause:onRecord} />
        <UploadButton />
      </>
    )
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.btnRow]}>
        {paused
          ?renderPausedBtns()
          :renderDefaultBtns()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  btnRow: {
    flexDirection: "row",
    marginVertical: 25,
    alignItems: "center"
  },
  recordIcon: {
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center"
  },
  stopIcon: {},
  square: {
    height: 25,
    width: 25,
    backgroundColor: "#fff"
  },
  icon: {
    height: 40,
    width: 40
  },
  solid: {
    backgroundColor: '#4F5C6A'
  },
  bordered: {
    borderWidth: 4,
    borderRadius: 5,
    borderColor: "#4F5C6A",
  }
})

export default Record
