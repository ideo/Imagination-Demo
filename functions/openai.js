const { Configuration, OpenAIApi } = require('openai')
const functions = require('firebase-functions')
const _ = require('lodash')

const configuration = new Configuration({
  apiKey: functions.config().openai.key,
})
const openai = new OpenAIApi(configuration)

module.exports = {
  async getDalle(msg, reaction = '') {
    console.log('Getting DALL-E with prompt: ' + msg)
    const response = await openai.createImage({
      prompt: msg,
      n: 1,
      size: '512x512',
      response_format: 'b64_json'
    })
    //functions.logger.info(response.data)
    const blob = response.data.data[0].b64_json
    return blob
  },
}
