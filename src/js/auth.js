import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import firebaseConfig from './firebase.json'

const app = initializeApp(firebaseConfig)
export const auth = getAuth()

export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user
      // ...
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      alert(errorMessage)
    })

export const signOutUser = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    })
}

export const toggleContent = (signedoutcontent, signedincontent) => {
  onAuthStateChanged(auth, (user) => {
    if (user) signedincontent()
    else signedoutcontent()
  })
}
