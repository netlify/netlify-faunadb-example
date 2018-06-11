'use strict';

const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

module.exports = (event, callback) => {
  const data = JSON.parse(event.body);
  console.log("update todo");
  return client.query(q.Update(q.Ref("classes/todos/"+event.pathParameters.id), {data}))
  .then((response) => {
    console.log("success", response);
    callback(false, response);
  }).catch((error) => {
    console.log("error", error);
    callback(error)
  })
};
