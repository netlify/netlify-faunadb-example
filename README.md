# Netlify + FaunaDB

Example of using [FaunaDB](https://fauna.com/) with [Netlify functions](https://www.netlify.com/docs/functions/)

Deploy this app with one-click via this link:

<!-- Markdown snippet -->
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/netlify-faunadb-example)

## About this application

This application is using [React](https://reactjs.org/) for the frontend, [Netlify Functions](https://www.netlify.com/docs/functions/) for API calls, and [FaunaDB](https://fauna.com/) as the backing database.

![faunadb netlify](https://user-images.githubusercontent.com/532272/42067494-5c4c2b94-7afb-11e8-91b4-0bef66d85584.png)

## Install

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
