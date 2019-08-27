# Netlify + FaunaDB &nbsp;&nbsp;&nbsp;<a href="https://app.netlify.com/start/deploy?repository=https://github.com/netlify/netlify-faunadb-example"><img src="https://www.netlify.com/img/deploy/button.svg"></a>

Example of using [FaunaDB](https://fauna.com/) with [Netlify functions](https://www.netlify.com/docs/functions/)

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [About this application](#about-this-application)
- [Setup & Run Locally](#setup--run-locally)
- [TLDR; Quick Deploy](#tldr-quick-deploy)
- [Tutorial](#tutorial)
  * [Background](#background)
  * [1. Create React app](#1-create-react-app)
  * [2. Setup FaunaDB](#2-setup-faunadb)
  * [3. Create a function](#3-create-a-function)
    + [Anatomy of a Lambda function](#anatomy-of-a-lambda-function)
    + [Setting up functions for local development](#setting-up-functions-for-local-development)
  * [4. Connect the function to the frontend app](#4-connect-the-function-to-the-frontend-app)
  * [5. Finishing the Backend Functions](#5-finishing-the-backend-functions)
  * [Wrapping Up](#wrapping-up)
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
    export FAUNADB_SERVER_SECRET=YourFaunaDBKeyHere
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

### Background

This application is using [React](https://reactjs.org/) for the frontend, [Netlify Functions](https://www.netlify.com/docs/functions/) for API calls, and [FaunaDB](https://fauna.com/) as the backing database.

We are going to explore how to get up and running with netlify functions and how to deploy your own serverless backend.

So, lets dive right in!

### 1. Create React app

We are using React for this demo app, but you can use whatever you want to manage the frontend.

Into VueJS? Awesome use that.

Miss the days of jQuery? Righto jQuery away!

Fan of vanillaJS? By all means, have at it!

1. Install create react app

    ```bash
    npm install create-react-app -g
    ```
2. Create the react app!

    ```bash
    create-react-app my-app
    ```

3. The react app is now setup!

    ```bash
    # change directories into my-app
    cd my-app
    # start the app
    npm start
    # install faunadb
    npm install faunadb
    ```

### 2. Setup FaunaDB

We are using FaunaDB to hold and store all of our todo data.

So setup a FaunaDB account and get our API key we will use to scaffold out our todos database.

Head over to [https://app.fauna.com/sign-up](https://app.fauna.com/sign-up) to create a free Fauna Account.

1. **Sign up**

    ![Sign up for Fauna](https://user-images.githubusercontent.com/532272/42112825-ff5d7804-7b9d-11e8-846b-54861fe88f97.png)

2. **Create a key**

    ![Create a fauna key](https://user-images.githubusercontent.com/532272/42112862-24b1cd9e-7b9e-11e8-8b77-7d2f0a981c65.png)

3. **Name your key and create**

    ![Name the fauna key and create](https://user-images.githubusercontent.com/532272/42112890-4653439c-7b9e-11e8-9573-361843c590aa.png)

4. **Copy this API key for later use, or [Deploy to Netlify Button](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/netlify-faunadb-example) and plugin this API key.**

    ![Copy API key for future use](https://user-images.githubusercontent.com/532272/42112934-6d6499e0-7b9e-11e8-81ea-be57249895b1.png)

5. **Create your FaunaDB database**

    Set the FaunaDB API key locally in your terminal

    ```bash
    # on mac
    export FAUNADB_SERVER_SECRET=YourFaunaDBKeyHere
    # on windows
    set FAUNADB_SERVER_SECRET=YourFaunaDBKeyHere
    ```

    Add the [/scripts/bootstrap-fauna-database.js](https://github.com/netlify/netlify-faunadb-example/blob/271721bbc0f1ad7980824a896e000be510763369/scripts/bootstrap-fauna-database.js) to the root directory of the project. This is an idempotent script that you can run 1 million times and have the same result (one todos database)

    Next up, add the bootstrap command to npm scripts in your `package.json` file

    ```json
    {
      "scripts": {
        "bootstrap": "node ./scripts/bootstrap-fauna-database.js"
      }
    }
    ```

    Now we can run the `bootstrap` command to setup our Fauna database in our FaunaDB account.

    ```bash
    npm run bootstrap
    ```

    If you login to the [FaunaDB dashboard](https://dashboard.fauna.com) you will see your todo database.

### 3. Create a function

Now, lets create a function for our app and wire that up to run locally.

The functions in our project are going to live in a `/functions` folder. You can set this to whatever you'd like but we like the `/functions` convention.

#### Anatomy of a Lambda function

All AWS Lambda functions have the following signature:

```js
exports.handler = (event, context, callback) => {
  // "event" has informatiom about the path, body, headers etc of the request
  console.log('event', event)
  // "context" has information about the lambda environment and user details
  console.log('context', context)
  // The "callback" ends the execution of the function and returns a reponse back to the caller
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: '⊂◉‿◉つ'
    })
  })
}
```

We are going to use the `faunadb` npm package to connect to our Fauna Database and create an item

#### Setting up functions for local development

Lets rock and roll.

1. **Create a `./functions` directory**

    ```bash
    # make functions directory
    mdkir functions
    ```

2. **Install `netlify-lambda`**

    [Netlify lambda](https://github.com/netlify/netlify-lambda) is a tool for locally emulating the serverless function for development and for bundling our serverless function with third party npm modules (if we are using those)

    ```
    npm i netlify-lambda --save-dev
    ```

    To simulate our function endpoints locally, we need to setup a [proxy](https://github.com/netlify/create-react-app-lambda/blob/master/package.json#L19-L26) for webpack to use.

    In `package.json` add:

    ```json
    {
      "name": "react-lambda",
      ...
      "proxy": {
        "/.netlify/functions": {
          "target": "http://localhost:9000",
          "pathRewrite": {
            "^/\\.netlify/functions": ""
          }
        }
      }
    }
    ```

    This will proxy requests we make to `/.netlify/functions` to our locally running function server at port 9000.

3. **Add our `start` & `build` commands**

    Lets go ahead and add our `start` & `build` command to npm scripts in `package.json`. These will let us running things locally and give a command for netlify to run to build our app & functions when we are ready to deploy.

    We are going to be using the `npm-run-all` npm module to run our frontend & backend in parallel in the same terminal window.

    So install it!

    ```
    npm install npm-run-all --save-dev
    ```

    **About `npm start`**

    The `start:app` command will run `react-scripts start` to run our react app

    The `start:server` command will run `netlify-lambda serve functions -c ./webpack.config.js` to run our function code locally. The `-c webpack-config` flag lets us set a custom webpack config to [fix a module issue](https://medium.com/@danbruder/typeerror-require-is-not-a-function-webpack-faunadb-6e785858d23b) with faunaDB module.

    Running `npm start` in our terminal will run `npm-run-all --parallel start:app start:server` to fire them both up at once.

    **About `npm build`**

    The `build:app` command will run `react-scripts build` to run our react app

    The `build:server` command will run `netlify-lambda build functions -c ./webpack.config.js` to run our function code locally.

    Running `npm run build` in our terminal will run `npm-run-all --parallel build:**` to fire them both up at once.


    **Your `package.json` should look like**

    ```json
    {
      "name": "netlify-fauna",
      "scripts": {
        "👇 ABOUT-bootstrap-command": "💡 scaffold and setup FaunaDB #",
        "bootstrap": "node ./scripts/bootstrap-fauna-database.js",
        "👇 ABOUT-start-command": "💡 start the app and server #",
        "start": "npm-run-all --parallel start:app start:server",
        "start:app": "react-scripts start",
        "start:server": "netlify-lambda serve functions -c ./webpack.config.js",
        "👇 ABOUT-prebuild-command": "💡 before 'build' runs, run the 'bootstrap' command #",
        "prebuild": "echo 'setup faunaDB' && npm run bootstrap",
        "👇 ABOUT-build-command": "💡 build the react app and the serverless functions #",
        "build": "npm-run-all --parallel build:**",
        "build:app": "react-scripts build",
        "build:functions": "netlify-lambda build functions -c ./webpack.config.js",
      },
      "dependencies": {
        "faunadb": "^0.2.2",
        "react": "^16.4.0",
        "react-dom": "^16.4.0",
        "react-scripts": "1.1.4"
      },
      "devDependencies": {
        "netlify-lambda": "^0.4.0",
        "npm-run-all": "^4.1.3"
      },
      "proxy": {
        "/.netlify/functions": {
          "target": "http://localhost:9000",
          "pathRewrite": {
            "^/\\.netlify/functions": ""
          }
        }
      }
    }

    ```

4. **Install FaunaDB and write the create function**

    We are going to be using the `faunadb` npm module to call into our todos index in FaunaDB.

    So install it in the project

    ```bash
    npm i faunadb --save
    ```

    Then create a new function file in `/functions` called `todos-create.js`

    <!-- AUTO-GENERATED-CONTENT:START (CODE:src=./functions/todos-create.js&header=/* code from functions/todos-create.js */) -->
    <!-- The below code snippet is automatically added from ./functions/todos-create.js -->
    ```js
    /* code from functions/todos-create.js */
    import faunadb from 'faunadb' /* Import faunaDB sdk */
    
    /* configure faunaDB Client with our secret */
    const q = faunadb.query
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_SECRET
    })
    
    /* export our lambda function as named "handler" export */
    exports.handler = (event, context, callback) => {
      /* parse the string body into a useable JS object */
      const data = JSON.parse(event.body)
      console.log("Function `todo-create` invoked", data)
      const todoItem = {
        data: data
      }
      /* construct the fauna query */
      return client.query(q.Create(q.Ref("classes/todos"), todoItem))
      .then((response) => {
        console.log("success", response)
        /* Success! return the response with statusCode 200 */
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(response)
        })
      }).catch((error) => {
        console.log("error", error)
        /* Error! return the error with statusCode 400 */
        return callback(null, {
          statusCode: 400,
          body: JSON.stringify(error)
        })
      })
    }
    ```
    <!-- AUTO-GENERATED-CONTENT:END -->

### 4. Connect the function to the frontend app

Inside of the react app, we can now wire up the `/.netlify/functions/todos-create` endpoint to an AJAX request.

```js
// Function using fetch to POST to our API endpoint
function createTodo(data) {
  return fetch('/.netlify/functions/todos-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

// Todo data
const myTodo = {
  title: 'My todo title',
  completed: false,
}

// create it!
createTodo(myTodo).then((response) => {
  console.log('API response', response)
  // set app state
}).catch((error) => {
  console.log('API error', error)
})
```

Requests to `/.netlify/function/[Function-File-Name]` will work seamlessly on localhost and on the live site because we are using the local proxy with webpack.


We will be skipping over the rest of the frontend parts of the app because you can use whatever framework you'd like to build your application.

All the demo React frontend code is [available here](https://github.com/netlify/netlify-faunadb-example/tree/17a9ba47a8b1b2408b68e793fba4c5fd17bf85da/src)

### 5. Finishing the Backend Functions

So far we have created our `todo-create` function done and we've seen how we make requests to our live function endpoints. It's now time to add the rest of our CRUD functions to manage our todos.

1. **Read Todos by ID**

    Then create a new function file in `/functions` called `todos-read.js`

    <!-- AUTO-GENERATED-CONTENT:START (CODE:src=./functions/todos-read.js&header=/* code from functions/todos-read.js */) -->
    <!-- The below code snippet is automatically added from ./functions/todos-read.js -->
    ```js
    /* code from functions/todos-read.js */
    import faunadb from 'faunadb'
    import getId from './utils/getId'
    
    const q = faunadb.query
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_SECRET
    })
    
    exports.handler = (event, context, callback) => {
      const id = getId(event.path)
      console.log(`Function 'todo-read' invoked. Read id: ${id}`)
      return client.query(q.Get(q.Ref(`classes/todos/${id}`)))
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

2. **Read All Todos**

    Then create a new function file in `/functions` called `todos-read-all.js`

    <!-- AUTO-GENERATED-CONTENT:START (CODE:src=./functions/todos-read-all.js&header=/* code from functions/todos-read-all.js */) -->
    <!-- The below code snippet is automatically added from ./functions/todos-read-all.js -->
    ```js
    /* code from functions/todos-read-all.js */
    import faunadb from 'faunadb'
    
    const q = faunadb.query
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_SECRET
    })
    
    exports.handler = (event, context, callback) => {
      console.log("Function `todo-read-all` invoked")
      return client.query(q.Paginate(q.Match(q.Ref("indexes/all_todos"))))
      .then((response) => {
        const todoRefs = response.data
        console.log("Todo refs", todoRefs)
        console.log(`${todoRefs.length} todos found`)
        // create new query out of todo refs. http://bit.ly/2LG3MLg
        const getAllTodoDataQuery = todoRefs.map((ref) => {
          return q.Get(ref)
        })
        // then query the refs
        return client.query(getAllTodoDataQuery).then((ret) => {
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify(ret)
          })
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

3. **Update todo by ID**

    Then create a new function file in `/functions` called `todos-update.js`

    <!-- AUTO-GENERATED-CONTENT:START (CODE:src=./functions/todos-update.js&header=/* code from functions/todos-update.js */) -->
    <!-- The below code snippet is automatically added from ./functions/todos-update.js -->
    ```js
    /* code from functions/todos-update.js */
    import faunadb from 'faunadb'
    import getId from './utils/getId'
    
    const q = faunadb.query
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_SECRET
    })
    
    exports.handler = (event, context, callback) => {
      const data = JSON.parse(event.body)
      const id = getId(event.path)
      console.log(`Function 'todo-update' invoked. update id: ${id}`)
      return client.query(q.Update(q.Ref(`classes/todos/${id}`), {data}))
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


4. **Delete by ID**

    Then create a new function file in `/functions` called `todos-delete.js`

    <!-- AUTO-GENERATED-CONTENT:START (CODE:src=./functions/todos-delete.js&header=/* code from functions/todos-delete.js */) -->
    <!-- The below code snippet is automatically added from ./functions/todos-delete.js -->
    ```js
    /* code from functions/todos-delete.js */
    import faunadb from 'faunadb'
    import getId from './utils/getId'
    
    const q = faunadb.query
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_SECRET
    })
    
    exports.handler = (event, context, callback) => {
      const id = getId(event.path)
      console.log(`Function 'todo-delete' invoked. delete id: ${id}`)
      return client.query(q.Delete(q.Ref(`classes/todos/${id}`)))
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



4. **Delete batch todos**

    Then create a new function file in `/functions` called `todos-delete-batch.js`

    <!-- AUTO-GENERATED-CONTENT:START (CODE:src=./functions/todos-delete-batch.js&header=/* code from functions/todos-delete-batch.js */) -->
    <!-- The below code snippet is automatically added from ./functions/todos-delete-batch.js -->
    ```js
    /* code from functions/todos-delete-batch.js */
    import faunadb from 'faunadb'
    import getId from './utils/getId'
    
    const q = faunadb.query
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_SERVER_SECRET
    })
    
    exports.handler = (event, context, callback) => {
      const data = JSON.parse(event.body)
      console.log('data', data)
      console.log("Function `todo-delete-batch` invoked", data.ids)
      // construct batch query from IDs
      const deleteAllCompletedTodoQuery = data.ids.map((id) => {
        return q.Delete(q.Ref(`classes/todos/${id}`))
      })
      // Hit fauna with the query to delete the completed items
      return client.query(deleteAllCompletedTodoQuery)
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

After we deploy all these functions, we will be able to call them from our frontend code with these fetch calls:

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/utils/api.js&header=/* Frontend code from src/utils/api.js */) -->
<!-- The below code snippet is automatically added from ./src/utils/api.js -->
```js
/* Frontend code from src/utils/api.js */
/* Api methods to call /functions */

const create = (data) => {
  return fetch('/.netlify/functions/todos-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const readAll = () => {
  return fetch('/.netlify/functions/todos-read-all').then((response) => {
    return response.json()
  })
}

const update = (todoId, data) => {
  return fetch(`/.netlify/functions/todos-update/${todoId}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

const deleteTodo = (todoId) => {
  return fetch(`/.netlify/functions/todos-delete/${todoId}`, {
    method: 'POST',
  }).then(response => {
    return response.json()
  })
}

const batchDeleteTodo = (todoIds) => {
  return fetch(`/.netlify/functions/todos-delete-batch`, {
    body: JSON.stringify({
      ids: todoIds
    }),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

export default {
  create: create,
  readAll: readAll,
  update: update,
  delete: deleteTodo,
  batchDelete: batchDeleteTodo
}
```
<!-- AUTO-GENERATED-CONTENT:END -->

### Wrapping Up

I hope you have enjoyed this tutorial on building your own CRUD API using Netlify serverless functions and FaunaDB.

As you can see, functions can be extremely powerful when combined with a cloud database!

The sky is the limit on what you can build with the JAM stack and we'd love to hear about what you make.

**Next Steps**

This example can be improved with users/authentication. Next steps to build out the app would be:

- Add in the concept of users for everyone to have their own todo list
- Wire up authentication using [Netlify Identity](https://identity.netlify.com/) JWTs
- Add in due dates to todos and wire up Functions to notify users via email/SMS
- File for IPO?
