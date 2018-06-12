import faunadb from 'faunadb'

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  console.log("Function `todo-read-all` invoked")
  return client.query(q.Paginate(q.Match(q.Ref("indexes/all_todos"))))
  .then((response) => {
    console.log("success", response)
    const newQuery = response.data.map((ref) => {
      console.log('ref', ref)
      return q.Get(ref)
    })
    // then query the refs
    return client.query(newQuery).then((ret) => {
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
