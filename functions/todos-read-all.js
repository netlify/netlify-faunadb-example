'use strict';

import faunadb from 'faunadb'
// const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

exports.handler = (event, context, callback) => {
  console.log("readAll todo");
  return client.query(q.Paginate(q.Match(q.Ref("indexes/all_todos"))))
  .then((response) => {
    console.log("success", response);
    callback(false, response);
  }).catch((error) => {
    console.log("error", error);
    callback(error)
  })
};
