<h1>Netlify + FaunaDB &nbsp;&nbsp;&nbsp;<a href="https://app.netlify.com/start/deploy?repository=https://github.com/netlify/netlify-faunadb-example"><img src="https://www.netlify.com/img/deploy/button.svg" title='click to deploy this project to Netlify'></a>
</h1>

Example of using [FaunaDB](https://fauna.com/) with [Netlify functions](https://www.netlify.com/docs/functions/)

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
undefined [Setup & Run Locally](#setup--run-locally)
- [TLDR; Quick Deploy](#tldr-quick-deploy)
- [Tutorial](#tutorial)
- [1. Setup FaunaDB](#1-setup-faunadb)
- [2. Create a function](#2-create-a-function)
<!-- AUTO-GENERATED-CONTENT:END -->

## About this application

This application is using [React](https://reactjs.org/) for the frontend, [Netlify Functions](https://www.netlify.com/docs/functions/) for API calls, and [FaunaDB](https://fauna.com/) as the backing database.

![faunadb netlify](https://user-images.githubusercontent.com/532272/42067494-5c4c2b94-7afb-11e8-91b4-0bef66d85584.png)

## Setup & Run Locally

1. Clone down the repository

    ```bash
    git clone git@github.com:netlify/netlify-faunadb-example.git
    ```

2. Install the dependencies

    ```bash
    npm install
    ```

3. Bootstrap your FaunaDB table

    ```bash
    npm run bootstrap
    ```

4. Set your Fauna API key value in your terminal enviroment

    You can create faunaDB keys here: https://dashboard.fauna.com/db/keys

    In your terminal run the following command:

    ```bash
    export FAUNADB_SECRET=YourFaunaDBKeyHere
    ```

5. Run project locally

    ```bash
    npm start
    ```

## TLDR; Quick Deploy

1. [Sign up for free FaunaDB account](https://app.fauna.com/sign-up),
2. Grab your [FaunaDB API key](https://dashboard.fauna.com/db/keys)
3. Click the [Deploy to Netlify Button](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/netlify-faunadb-example)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/netlify-faunadb-example)

![setup steps](https://user-images.githubusercontent.com/532272/42069927-28e1c436-7b09-11e8-96e9-272987fc9e15.gif)

## Tutorial

First lets create the

1. Step faunaDB
2. Create /functions/todos-create.js
3.

### 1. Setup FaunaDB

First things first, we need to setup a FaunaDB account and get our API key we will use to scaffold out our todos database.

Head over to [https://app.fauna.com/sign-up](https://app.fauna.com/sign-up) to create a free Fauna Account.

Then login, and create your API Key

[IMAGE]

### 2. Create a function


Lambda functions have this signature:

```js
exports.handler = (event, context, callback) => {
  // event has informatiom about the path, body, headers etc of the request
  console.log('event', event)
  // context has information about the lambda environment and user details
  console.log('context', context)
  // The callback ends the execution of the function and returns a reponse back to the caller
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: '⊂◉‿◉つ'
    })
  })
}
```

We are going to be using the FaunaDB sdk to call into our todos index.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./functions/todos-create.js) -->
<!-- The below code snippet is automatically added from ./functions/todos-create.js -->
```js
/* Import faunaDB sdk */
import faunadb from 'faunadb'

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body)
  console.log("Function `todo-create` invoked", data)
  const todoItem = {
    data: data
  }
  /* construct the fauna query */
  return client.query(q.Create(q.Ref("classes/todos"), todoItem))
  .then((response) => {
    console.log("success", response)
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    })
  }).catch((error) => {
    console.log("error", error)
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    })
  })
}
```
<!-- AUTO-GENERATED-CONTENT:END -->
