'use strict';

import faunadb from 'faunadb'
// const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

exports.handler = (event, context, callback) => {
  console.log("delete todo");
  return client.query(q.Delete(q.Ref("classes/todos/"+event.pathParameters.id)))
  .then((response) => {
    console.log("success", response);
    callback(false, response);
  }).catch((error) => {
    console.log("error", error);
    callback(error)
  })
};
