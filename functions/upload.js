var serviceAccount = require("./imagination-demo-firebase-adminsdk-vuph6-2d6dfb8040.json")

const functions = require('firebase-functions')
const admin = require('firebase-admin')    

// you also have to install gsutils and set cors on your bucket
// gcloud auth login
// cors set cors.json gs://imagination-demo.appspot.com

admin.initializeApp({
    projectId: serviceAccount.project_id, 
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://imagination-demo.appspot.com",
    storageBucket: "imagination-demo.appspot.com"
  });

exports.uploadImage = async (imageBytes64Str, name) => {

    const bucket = admin.storage().bucket()
    const imageBuffer = Buffer.from(imageBytes64Str, 'base64')
    const imageByteArray = new Uint8Array(imageBuffer);
    const file = bucket.file(`${name}.png`);
    const options = { resumable: false, metadata: { contentType: "image/png" } }

    //options may not be necessary
    return file.save(imageByteArray, options)
    .then(stuff => {
        return file.getSignedUrl({
            action: 'read',
            expires: '03-09-2500'
          })
    })
    .then(urls => {
        const url = urls[0];
        console.log(`Image url = ${url}`)
        return url
    })
    .catch(err => {
        console.log(`Unable to upload image ${err}`)
    })
}