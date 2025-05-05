# Messenger web client


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version v20.10.0
- Install [Yarn](https://yarnpkg.com/) version v1.22.22

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|ENVIRONMENT            | development | production            | "development"                                          |


# Getting started
- Clone the repository
```
git clone git@xxxxxxx.git <project_name>
```
- Install dependencies
```
cd <project_name>
yarn install
```
- Build project
```
yarn build
```

- Build project for release
```
yarn build:tsup
```

- Run the project dev mode
```
yarn dev:examples
```

## Getting TypeScript
Add Typescript to project `yarn`.
```
yarn add -D typescript
```

## Project Structure
The folder structure of this app is explained below:

| Name                      | Description                                                                                        |
| ------------------------  | ---------------------------------------------------------------------------------------------      |
| **dist**                  | Contains the distributable (or output) from your TypeScript build.                                 |
| **node_modules**          | Contains all  npm dependencies                                                                     |
| **src**                   | Contains  source code that will be compiled to the dist dir                                        |
| **configuration**         | Application configuration including environment-specific configs                                   |
| **src/examples/**         | Examples                                                                                           |
| **src/utils/crypto**      | Encrypt and decrypt                                                                                |
| **src/utils/request/**    | Request instance                                                                                   |
| **src/utils/storage/**    | Secure wrapped storage                                                                             |
| **src/messenger.ts        | Messenger web client class                                                                         |
| package.json              | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   |
| tsconfig.json             | Config settings for compiling source code only written in TypeScript                               |

## Building the project
### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description  |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node on dist/index.js. Can be invoked with `yarn start`                  |
| `build`                   | Full build. Runs ALL build tasks                                                                  |
| `build:tsup`              | Full build. Runs ALL build tasks                                                                  |
| `dev`                     | Runs full build before starting all watch tasks. Can be invoked with `yarn dev`                   |
| `format`                  | Lint                                                                                              |

# Common Issues
