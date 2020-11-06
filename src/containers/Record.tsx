// eslint-disable-next-line
import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { COLORS } from '../common/colors'
import Button, { ButtonProps } from '../components/Button'
import RecordingService from '../services/RecordingService'

// Button components for screen recorder
const RecordButton:React.FC<ButtonProps> = (props) => {
  const Icon = <View style={[styles.recordIcon]} />
  return <Button {...props}>{Icon}</Button>
}

const StopButton:React.FC<ButtonProps> = (props) => {
  const Icon = (
    <View style={[styles.recordIcon]}>
      <View style={[styles.square]} />
    </View>
  )
  return <Button {...props}>{Icon}</Button>
}

const UploadButton:React.FC<ButtonProps> = (props) => {
  return (
    <Button {...props}>
      <Image style={[styles.icon]} source={require('../assets/image.png')} />
    </Button>
  )
}

const RecordScreenButton:React.FC<ButtonProps> = (props) => {
  return (
    <Button {...props}>
      <Image style={[styles.icon]} source={require('../assets/monitor.png')} />
    </Button>
  )
}

const AcceptButton:React.FC<ButtonProps> = (props) => {
  return (
    <Button {...props}>
      <Image
        style={[styles.icon, styles.solid, { tintColor: COLORS.white }]}
        source={require('../assets/check.png')}
      />
    </Button>
  )
}

const DiscardButton:React.FC<ButtonProps> = (props) => {
  return (
    <Button {...props}>
      <Image
        style={[styles.icon, styles.bordered]}
        source={require('../assets/cross.png')}
      />
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
    console.log('sss', success)
    if (!success) {
      setRecording(false)
      setPaused(false)
    }
  }

  const onResume = () => {
    RecordingService.resumeRecording()
    setRecording(true)
    setPaused(false)
  }

  const onPause = () => {
    setPaused(true)
    setRecording(false)
    RecordingService.pauseRecording()
  }

  const onDiscard = () => {
    setPaused(false)
    setRecording(false)
    RecordingService.stopRecording()
  }

  const onAccept = () => {
    setRecording(false)
    setPaused(false)
    RecordingService.downloadVideo()
  }

  const renderPausedBtns = () => {
    return (
      <>
        <DiscardButton onPress={onDiscard} />
        <StopButton onPress={onResume} />
        <AcceptButton onPress={onAccept} />
      </>
    )
  }

  const renderDefaultBtns = () => {
    return (
      <>
        <RecordScreenButton disabled={recording} onPress={onRecord} />
        <RecordButton onPress={recording ? onPause : onRecord} />
        <UploadButton />
      </>
    )
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.btnRow]}>
        {paused ? renderPausedBtns() : renderDefaultBtns()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  btnRow: {
    flexDirection: 'row',
    marginVertical: 25,
    alignItems: 'center'
  },
  recordIcon: {
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center'
  },
  square: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white
  },
  icon: {
    height: 40,
    width: 40
  },
  solid: {
    backgroundColor: COLORS.grey
  },
  bordered: {
    borderWidth: 4,
    borderRadius: 5,
    borderColor: COLORS.grey
  }
})

export default Record
