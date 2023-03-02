// Test import of a JavaScript module
import { createScene } from '@/js/scene'
import { signIn, toggleContent } from '@/js/auth'

// Test import of styles
import '@/styles/index.scss'

const initApp = () => {
  const app = document.querySelector('#app-root')
  const login = document.querySelector('#login-root')
  const buildLogin = () => {
    app.style.display = 'none'
    login.style.display = 'block'
    const form = document.querySelector('form')
    form.addEventListener('submit', handleSubmit)

    function handleSubmit(event) {
      event.preventDefault()

      // Get the values of the email and password fields
      const email = document.querySelector('#email').value
      const password = document.querySelector('#password').value

      // Perform some validation on the email and password inputs
      if (!email || !password) {
        alert('Please enter your email and password.')
        return
      }

      // Submit the form to the server
      signIn(email,password)
    }
  }
  const buildApp = () => {
    app.style.display = 'block'
    login.style.display = 'none'
    createScene(app)
  }
  toggleContent(buildLogin, buildApp)
}

window.onload = function () {
  initApp()
}
