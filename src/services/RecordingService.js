import React from 'react'

const RECORD_OPTIONS = {
    video: {
      cursor: "always"
    },
    audio: true
}

export default class RecordingService {
  /**
   * static ref for video node
   */
  static videoRef = document.getElementById("video")
  static msgContainer = document.getElementById("message")
  static mediaRecorder = null
  static micStream = null
  static fullStream = null
  static recordedChunks = []

  /**
   * function to record screen
   */
  static startRecording = async () => {
    try {
      this.videoRef.style.display='block'
      this.videoRef.setAttribute('autoplay',true)
      this.recordVideo()
      return true
    } catch (err) {
      console.error("Error: " + err)
      return false
    }
  }

  /**
   * function to stop recording
   */
  static stopRecording = () => {
    try {
      let tracks = this.videoRef.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.videoRef.srcObject = null;
      this.removeMessage()
    } catch (error) {
      console.error("error: ",error) 
    }
  }

  /**
   * function to pause recording
   */
  static pauseRecording = () => {
    try {
      let tracks = this.videoRef.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.hideVideo()
      this.showMessage()
      this.endRecording()
    } catch (error) {
      console.error("error: ",error)
    }
  }

  /**
   * function to hide video
   */
  static hideVideo = () => {
    this.videoRef.style.display="none"
  }

  /**
   * function to show message on pause
   */
  static showMessage = () => {
    try {
      this.msgContainer.style.display="flex"
    } catch (error) {
      console.error("error: ",error)
    }
  }

  /**
   * function to hide message
   */
  static removeMessage = () => {
    this.msgContainer.style.display='none'
  }

  static recordVideo = async () => {
    this.micStream = await navigator.mediaDevices.getUserMedia({audio:true})
    this.videoRef.srcObject = await navigator.mediaDevices.getDisplayMedia(RECORD_OPTIONS)
    // combine video and audio tracks
    const vid = this.videoRef.srcObject
    const mic = this.micStream
    this.fullStream = new MediaStream([
      ...vid.getVideoTracks(),
      ...mic.getAudioTracks()
    ])
    // play video with audio
    this.videoRef.srcObject=this.fullStream

    const handleDataAvailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    }
    const options = {mimeType: 'video/webm'};
    this.mediaRecorder = new MediaRecorder(this.fullStream, options);
    this.mediaRecorder.ondataavailable = handleDataAvailable;
    this.mediaRecorder.start();
  }

  static endRecording = async () => {
    this.mediaRecorder.stop()
    
  }

  static downloadVideo = () => {
    const blob = new Blob(this.recordedChunks, {
      type: 'video/webm'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'video.webm';
    a.click();
    window.URL.revokeObjectURL(url);
    this.removeMessage()
  }
}
