# ThreeVR

Demo of three.js for VR, includes hand and touch controller interaction and locomotion options
Also includes picovoice voice recognition and a connection to openai's dalle-2 API

## Installation

Clone this repo and yarn install.

```bash
yarn install
```
Create a new firebase project and configure hosting, authentication, firestore and functions

Sign up for [picovoice](https://console.picovoice.ai/) and create a `creds.js` within `src/js/pico/` that looks like:

```js
export default 'YOUR_KEY';
```

Sign up for OpenAI and create an API key

Set your key in firebase

Download your config for local testing

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
