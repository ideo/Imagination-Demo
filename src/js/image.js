export const getImage = (prompt, callback) => {
  const endpoint = 'https://us-central1-imagination-demo.cloudfunctions.net/getImage' // 'http://127.0.0.1:5001/imagination-demo/us-central1/getImage' //

  const xhr = new XMLHttpRequest()
  xhr.open('POST', endpoint, true)

  //Send the proper header information along with the request
  xhr.setRequestHeader('Content-Type', 'text/plain')

  xhr.onreadystatechange = () => {
    // Call a function when the state changes.
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // Request finished. Do processing here.
      callback(xhr.responseText)
    }
  }
  xhr.send(prompt)
}
