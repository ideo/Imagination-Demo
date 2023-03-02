const functions = require('firebase-functions')
const openai = require('./openai')
const { uploadImage } = require('./upload')
const cors = require('cors')({
  origin: true,
})
const crypto = require('crypto')


exports.getImage = functions.https.onRequest(async (request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  const prompt = request.body
  const blob = await openai.getDalle(prompt)
  const url = await uploadImage(blob, crypto.randomUUID())

  cors(request, response, () => {
    response.status(200).send(url)
  })
})
