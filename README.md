# Interview Scheduler

A react app using express that can create appointments for people selecting interviews online. Users can check how many interviews are in a day, can edit or delete current interviews. Also the app comes with websockets, therefore people online can see realtime updates to the scheduler app.

## Screenshots

![Home Page](https://i.imgur.com/En1EvsM.png "Home Page")
![Creating an interview](https://i.imgur.com/b0Ad7b9.png "Creating an interview")
![Delete an interview](https://i.imgur.com/Xo6DUDI.png "Delete an interview")

## Project Frameworks/Dependencies

This uses javascript, react, cypress, jest, storybook and axios. Dependencies include classNames, normalize.css, react-dom, react-scripts and dev dependencies include prop-types, react-test-renderer and sass.

## Setup

Make sure to clone the scheduler-api
https://github.com/JasonSnow123/scheduler-api
Install the server following the README.md

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Running Cypress End-to-End Testing

```sh
npm run cypress
```
