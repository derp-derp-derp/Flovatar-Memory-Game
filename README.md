# Flovatar Memory Game

Play memory with your own Flovatars. [https://memory.flov.dev](https://memory.flov.dev)

Technically you can host this anywhere you'd like, as it's just static HTML / CSS / JavaScript, but we chose [Firebase Hosting](https://firebase.google.com/docs/hosting).

***

## Implemented tech highlights

- [FCL JS Vanilla - thank you to bluesign.find!](http://tymianek.com/vanilla/)
    - Implements Authentication, Wallet Discovery, and executing a Cadence Script
- Flovatar Image API [e.g.](https://images.flovatar.com/flovatar/png/4938-nobg.png)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

***

## Create a Firebase project

- Visit [https://console.firebase.google.com/](https://console.firebase.google.com/) and create a project.
- Name it whatever you'd like. The name doesn't matter much.

## Install the Firebase CLI

- [https://firebase.google.com/docs/cli](https://firebase.google.com/docs/cli)

The CLI commands can now be accessed by running `firebase`.

## Firebase config

Edit the following files to point to your Firebase project and Firebase Hosting site instead of ours:

- `.firebaserc`: Firebase project definition
- `firebase.json`: Firebase project config

## Deployment to Firebase Hosting

- `firebase deploy --only hosting`