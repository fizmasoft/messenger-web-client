# Messenger kpi project


# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version v20.10.0

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|ENVIRONMENT            | development | production            | "development"                                          |
|LOG_LEVEL              | Log level                           | "error"                                                |
|BASE_URL               |                                     | ""                                                     |
|BACKEND_CONTAINER_NAME | Nodejs docker container name        | "backend"                                              |
|HTTP_HOST              | Hos                                 | "0.0.0.0"                                              |
|HTTP_PORT              |                                     | 3000                                                   |
|JWT_SECRET_ACCESS      |                                     | JWT_SECRET_ACCESS                                      |
|JWT_SECRET_REFRESH     |                                     | JWT_SECRET_REFRESH                                     |
|JWT_EXPIRE_ACCESS      |                                     | 15M                                                    |
|JWT_EXPIRE_REFRESH     |                                     | 1W                                                     |
|HTTP_PORT              |                                     | 4000                                                   |
|BOT_CHAT_ID            |                                     |                                                        |
|BOT_TOKEN              |                                     |                                                        |


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
- Build and run the project
```
yarn dev
```
  Navigate to `http://localhost:3000`

- API Document endpoints

  swagger Spec Endpoint : http://localhost:3000/v1/api-docs 


# TypeScript + Node 
The Rest APIs will be using the Swagger (OpenAPI) Specification.

## Getting TypeScript
Add Typescript to project `yarn`.
```
yarn add -D typescript
```

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------  | --------------------------------------------------------------------------------------------- |
| **dist**                  | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**          | Contains all  npm dependencies                                                            |
| **src**                   | Contains  source code that will be compiled to the dist dir                               |
| **configuration**         | Application configuration including environment-specific configs 
| **src/domain/controllers**| Controllers define functions to serve various express routes. 
| **src/middlewares**       | Express middlewares which process the incoming requests before handling them down to the routes
| **src/domain/routes**     | Contain all express routes, separated by module/area of application                       
| **src/domain/server.ts          | Entry point to express app                                                               |
| package.json              | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | tsconfig.json            | Config settings for compiling source code only written in TypeScript    

## Building the project
### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description  |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node on dist/index.js. Can be invoked with `yarn start`                  |
| `build`                   | Full build. Runs ALL build tasks                                                                  |
| `dev`                     | Runs full build before starting all watch tasks. Can be invoked with `yarn dev`                   |
| `seed:all`                | Runs all seeders. Can be invoked with `yarn seed:all`                                             |


# Swagger
## Specification
The swagger specification file is named as swagger.yaml. The file is located under definition folder.
Example:
```
paths:
  /hello:
    get:
      x-swagger-router-controller: helloWorldRoute
      operationId: helloWorldGet
      tags:
        - /hello
      description: >-
        Returns the current weather for the requested location using the
        requested unit.
      parameters:
        - name: greeting
          in: query
          description: Name of greeting
          required: true
          type: string
      responses:
        '200':
          description: Successful request.
          schema:
            $ref: '#/definitions/Hello'
        default:
          description: Invalid request.
          schema:
            $ref: '#/definitions/Error'
definitions:
  Hello:
    properties:
      msg:
        type: string
    required:
      - msg
  Error:
    properties:
      message:
        type: string
    required:
      - message
```

# Common Issues
