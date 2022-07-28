# Amplified.tools UI

This React repository is for a homebrew project, [amplified.tools](https://www.amplified.tools), to provide more powerful, automated ways of interacting with your Spotify playlists.

## Development

### Setup

1. Create a new `.env` file based on [.env.example](./.env.example)

1. Create a new `config.ts` file based on [config.example.ts](./config.example.ts) which contains Amazon Cognito User Pool and Amplified.tools API config

1. Clone and start [amplified-tools-api](https://github.com/ghostfuel/amplified-tools-api#readme)

Run `npm start` to launch the development server at [http://localhost:3001](http://localhost:3001)

## Deployment

Run `npm run aws:deploy` to build and sync the build/ directory to an S3 bucket.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
