'use strict';

import faunadb from 'faunadb'
// const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

module.exports = (event, callback) => {
  const data = JSON.parse(event.body);
  console.log("create todo", data);
  return client.query(q.Create(q.Ref("classes/todos"), {data}))
  .then((response) => {
    console.log("success", response);
    callback(false, response);
  }).catch((error) => {
    console.log("error", error);
    callback(error)
  })
};
