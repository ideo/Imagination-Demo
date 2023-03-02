import { LeopardWorker } from '@picovoice/leopard-web'
import { WebVoiceProcessor } from '@picovoice/web-voice-processor'
import { modelParams } from './pico/leopard_params'
import * as accessKey from './pico/creds'

export const setupPico = (writeMessage, displayOutput) => {
  const ret = {
    startRecord: null,
    stopRecord: null
  }

  async function startLeopard(accessKey) {
    writeMessage('Getting set up. Please wait...')
    try {
      const leopard = await LeopardWorker.create(
        accessKey,
        { base64: modelParams },
        { enableAutomaticPunctuation: true }
      )
      writeMessage('Ready to hear your requests!\npress and hold X and speak')

      let timer = null
      let currentTimer = 0.0
      let audioData = []
      const recorderEngine = {
        onmessage: (event) => {
          switch (event.data.command) {
            case 'process':
              audioData.push(event.data.inputFrame)
              break
          }
        },
      }
      ret.startRecord =  async () => {

        currentTimer = 0.0
        audioData = []
        try {
          writeMessage('Recording audio...')
          await WebVoiceProcessor.subscribe(recorderEngine)
          timer = setInterval(() => {
            currentTimer += 0.1
            if (currentTimer === 120) {
              ret.stopRecord()
            }
          }, 100)
        } catch (e) {
          writeMessage(e)
        }
      }

      ret.stopRecord = async () => {

        await WebVoiceProcessor.unsubscribe(recorderEngine)
        clearInterval(timer)

        const frames = new Int16Array(audioData.length * 512)
        for (let i = 0; i < audioData.length; i++) {
          frames.set(audioData[i], i * 512)
        }

        writeMessage('Transcribing audio file...')
        const { transcript, words } = await leopard.process(frames, { transfer: true })
        displayOutput(transcript)
        writeMessage('Click Y to generate your pattern\nor hold X to re-record')
      }
    } catch (err) {
      writeMessage(err)
    }
  }

  startLeopard(accessKey.default)

  return ret
}
