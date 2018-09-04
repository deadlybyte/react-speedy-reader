## Prerequisites

* [Node.js v7.6+](https://nodejs.org)

## Installation

- Running `npm install` in the component's root directory will install everything you need for development.

## Demo Development Server

- `npm start` will run a development server with the component's demo app at [http://localhost:9001](http://localhost:9001) with hot module reloading.

## Running Tests

- `npm test` will run the tests and produce a coverage report in `coverage/`.

## Documentation

- `npm run jsdoc` will build the documentation for the component in `jsdoc/`.

## Linting

- `npm run eslint` will run linting against the `src` and `test` folders.

## Building

- `npm run build` will build the component for publishing to npm.

- `npm run demo` will build the component for publishing to npm and also build the demo app in `demo/`.

## Pre-publish

- `npm run prepublishOnly` will build the component for publishing to npm along with the documention for the component in `jsdoc/`.

## Publish

- `npm version patch`
- `git push --tags`

`npm publish` is handled by travis-ci when a tag is created.
