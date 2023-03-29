# ThreeVR

Demo of three.js for VR, includes hand and touch controller interaction and locomotion options
Also includes picovoice voice recognition and a connection to openai's dalle-2 API

## Installation

Clone this repo and yarn install.

```bash
yarn install
```
Create a new Firebase project and configure hosting, authentication, storage and functions

- Go to https://console.firebase.google.com/ and create a new project
- Go to build -> authentication -> sign-in method and choose Email/Password, create a user and password
- Go to build -> storage and enable storage
    - setup the ability for your functions to write to storage using the instructions [here](https://stackoverflow.com/questions/53143965/uploading-files-from-firebase-cloud-functions-to-cloud-storage).
    - setup cors via `gsutils` 
    

Setup firebase configuration in your local repo

- In Firebase, go to Project Overview -> click the project name -> click the settings icon to go to project settings. 
- In Project Settings, copy (or create and copy) the configuration data in the curly braces (including the curly braces). 
- In `src/js`, create a file called `firebase.json` and paste the configuration data into the file. Format for json by replacing quotes as appropriate.
- Open a new terminal from the root directory of your repo in VSCode, type `firebase login` to log in from the terminal 
- In terminal, type `firebase init` and select the id of the project you just made
    -  Choose to set up hosting, functions already exist in the repo (but you will be using them), do not set up github actions

Sign up for [picovoice](https://console.picovoice.ai/) and create a `creds.js` within `src/js/pico/` that looks like:

```js
export default 'YOUR_KEY';
```

Sign up for OpenAI and create an API key

Set your OpenAI API key in firebase
- Type `firebase functions:config:set openai.key="THE API KEY"` in the terminal
- In terminal, go to `/functions` using `cd functions` from your root directory
- Type `firebase functions:config:get > .runtimeconfig.json` in the terminal
- In `.runtimeconfig.json` file, you should see this:
```jSON
{
  "openai": {
    "key": "YOUR OPENAI API KEY"
  }
}
```

## Usage

### Development server

```bash
yarn start
```

You can view the development server at `localhost:8080`.

If you'd like to test your functions locally, switch out your functions url to a local version and run this command in a separate terminal to start the local functions emulator:

```bash
yarn start-functions
```

### Production build

```bash
yarn build
```
