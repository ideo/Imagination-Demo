# ThreeVR

Demo of three.js for VR, includes hand and touch controller interaction and locomotion options
Also includes picovoice voice recognition and a connection to openai's dalle-2 API

## Installation

Clone this repo and yarn install.

```bash
yarn install
```
Create a new Firebase project and configure hosting, authentication, firestore and functions

- Go to https://console.firebase.google.com/ and create a new project
- Go to build -> authentication -> sign-in method and choose Email/Password, create a user and password
- Go to build -> storage and enable firestore
    - setup cors via `gsutils`

Setup firebase configuration in your local repo

- In Firebase, go to Project Overview -> click the project name -> click the settings icon to go to project settings. 
- In Project Settings, copy the configuration data in the curly braces (including the curly braces). 
- In `src/js`, create a file called `firebase.json` and past the configuration data into the file. 
- Open a new terminal from the root directory of your repo in VSCode, type `firebase login` to log in from the terminal 
- In terminal, type `firebase init` and select the id of the project you just made
    -  Choose to set up hosting, functions already exist in the repo, do not set up github actions

Sign up for [picovoice](https://console.picovoice.ai/) and create a `creds.js` within `src/js/pico/` that looks like:

```js
export default 'YOUR_KEY';
```

Sign up for OpenAI and create an API key

Set your OpenAI API key in firebase
- In terminal, go to `/functions` using `cd functions` from your root directory
- Type `firebase functions:config:get > .runtimeconfig.json` in the terminal
- In `.runtimeconfig.json` file, add the code below and replace with your OpenAI API key
```jSON
{
  "openai": {
    "key": "YOUR OPENAI API KEY"
  }
}
```

Download your config for local testing
- Download and past the config file into `/functions` folder.

Configure link in app

## Usage

### Development server

```bash
yarn start
```

You can view the development server at `localhost:8080`.

### Production build

```bash
yarn build
```
