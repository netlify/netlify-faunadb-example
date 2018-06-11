'use strict';

const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

module.exports = (event, callback) => {
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
