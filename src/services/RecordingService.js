// screen sharing options
const RECORD_OPTIONS = {
    video: {
      cursor: "always"
    },
    audio: true
}

// video format options
const VIDEO_OPTIONS ={
  mimeType: 'video/webm'
}

export default class RecordingService {
  /**
   * @var videoRef ref for html video element
   * @var msgContainer ref for html message node
   * @var micStream ref for audio recorder
   * @var fullStream combined video and audio MediaStream
   * @var recordedChunks video data recorded
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
    try {
      this.videoRef.style.display="none"
    } catch (error) {
      console.log(error.message)
    }
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
    try {
      this.msgContainer.style.display='none'
    } catch (error) {
      console.log(error.message)
    }
  }
  /**
   * function to save shared screen in memory
   */
  static recordVideo = async () => {
    try {
      // combine video and audio tracks as stream and play on screen
      this.micStream = await navigator.mediaDevices.getUserMedia({audio:true})
      this.videoRef.srcObject = await navigator.mediaDevices.getDisplayMedia(RECORD_OPTIONS)
      const vid = this.videoRef.srcObject
      const mic = this.micStream
      this.fullStream = new MediaStream([
        ...vid.getVideoTracks(),
        ...mic.getAudioTracks()
      ])
      this.videoRef.srcObject=this.fullStream

      // convert stream to webm format
      this.mediaRecorder = new MediaRecorder(this.fullStream, VIDEO_OPTIONS);
      this.mediaRecorder.ondataavailable = this.handleDataAvailable;
      this.mediaRecorder.start();
    } catch (error) {
      console.log("Error: ",error.message)
    }
  }

  /**
   * event handler that records chunks of tracks
   * @param {object} event recorded video data
   */
  static handleDataAvailable = (event) => {
    if (event && event.data.size > 0) {
      this.recordedChunks.push(event.data);
    }
  }

  /**
   * function stop saving recording to memory
   */
  static endRecording = async () => {
    try {
      this.mediaRecorder.stop()
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * function to download recorded video
   */
  static downloadVideo = () => {
    try {
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
    } catch (error) {
      console.log("Error: ",error.message)
    }
  }
}
