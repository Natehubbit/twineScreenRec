// screen sharing options
const RECORD_OPTIONS = {
  video: true
}

const AUDIO_OPTIONS = {
  audio: {
    noiseSuppression: true,
    echoCancellation: true,
    sampleRate: 44100
  }
}
export default class RecordingService {
  /**
   * @var videoRef ref for html video element
   * @var msgContainer ref for html message node
   * @var micStream ref for audio recorder
   * @var fullStream combined video and audio MediaStream
   * @var recordedChunks video data recorded
   */
  // ref for html video element
  static videoRef = document.getElementById('video') as HTMLVideoElement
  // ref for html message node
  static msgContainer = document.getElementById('message')
  // ref for video recorder
  static mediaRecorder:MediaRecorder|null = null
  // ref for audio recorder
  static micStream: MediaStream|null = null
  // combined video and audio MediaStream
  static fullStream: MediaStream|null = null
  // video blob data recorded
  static recordedChunks:BlobEvent['data'][] = []

  /**
   * function to record screen
   */
  static async startRecording () {
    try {
      if (this.videoRef) {
        this.videoRef.style.display = 'block'
        this.videoRef.setAttribute('autoplay', 'true')
        return this.recordVideo()
      }
      return false
    } catch (err) {
      console.error('Error: ' + err)
      return false
    }
  }

  /**
   * function to stop recording
   */
  static stopRecording () {
    try {
      if (this?.videoRef?.srcObject) {
        const tracks = (this.videoRef.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
        this.removeMessage()
        this.mediaRecorder && this.mediaRecorder.stop()
        this.videoRef.srcObject = null
        console.log('chho', this.recordedChunks)
        this.recordedChunks = []
      }
    } catch (error) {
      console.error('error: ', error)
    }
  }

  /**
   * function to pause recording
   */
  static pauseRecording () {
    try {
      if (this.mediaRecorder) {
        this.mediaRecorder.pause()
        this.hideVideo()
        this.showMessage()
      }
    } catch (error) {
      console.error('error: ', error)
    }
  }

  /**
   * function to hide video
   */
  static hideVideo () {
    try {
      this.videoRef.style.display = 'none'
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * function to show video
   */
  static showVideo () {
    try {
      this.videoRef.style.display = 'flex'
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * continue recording from paused recorder
   */
  static resumeRecording () {
    try {
      if (this.mediaRecorder) {
        this.mediaRecorder.resume()
        this.showVideo()
        this.removeMessage()
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * function to show message on pause
   */
  static showMessage () {
    try {
      if (this.msgContainer) {
        this.msgContainer.style.display = 'flex'
      }
    } catch (error) {
      console.error('error: ', error)
    }
  }

  /**
   * function to hide message
   */
  static removeMessage () {
    try {
      if (this.msgContainer) {
        this.msgContainer.style.display = 'none'
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * function to save shared screen in memory
   */
  static async recordVideo () {
    try {
      // combine video and audio tracks as stream and play on screen
      if (this.videoRef) {
        let vid = this.videoRef.srcObject
        let mic = this.micStream
        mic = await navigator.mediaDevices.getUserMedia(AUDIO_OPTIONS)
        vid = await (navigator.mediaDevices as any).getDisplayMedia(RECORD_OPTIONS)
        this.fullStream = new MediaStream([
          ...(vid as MediaStream).getVideoTracks(),
          ...mic.getAudioTracks()
        ])
        this.videoRef.srcObject = vid
        // record and parse streamed data
        this.mediaRecorder = new MediaRecorder(this.fullStream)
        this.mediaRecorder.ondataavailable =
          e => this.handleDataAvailable(e, this.recordedChunks)
        this.mediaRecorder.start()
        return true
      }
      return false
    } catch (error) {
      console.log('Error', error.message)
      return false
    }
  }

  /**
   * event handler that records chunks of tracks
   * @param {BlobEvent} event recorded video data
   * @param {BlobEvent["data"][]} chunkz blob video data recorded
   */
  static handleDataAvailable (event:BlobEvent, chunkz:BlobEvent['data'][]) {
    if (event && event.data.size > 0) {
      chunkz.push(event.data)
    }
  }

  /**
   * function to download recorded video
   */
  static downloadVideo () {
    try {
      this.stopRecording()
      setTimeout(() => {
        const { type } = this.recordedChunks[0]
        const blob = new Blob(this.recordedChunks, {
          type
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = 'video.mp4'
        a.click()
        window.URL.revokeObjectURL(url)
        this.removeMessage()
      }, 500)
    } catch (error) {
      console.log('Error: ', error.message)
    }
  }
}
