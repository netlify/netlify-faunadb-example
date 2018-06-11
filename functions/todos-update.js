'use strict';

import faunadb from 'faunadb'
// const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);
  console.log("update todo");
  return client.query(q.Update(q.Ref("classes/todos/"+event.pathParameters.id), {data}))
  .then((response) => {
    console.log("success", response);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    })
  }).catch((error) => {
    console.log("error", error);
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    })
  })
};
