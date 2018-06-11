/* bootstrap database in your FaunaDB account */
const readline = require('readline');
const faunadb = require('faunadb');
const q = faunadb.query;

ask('Enter your faunaDB server key', function(err, answer) {
  const key = answer || process.env.FAUNADB_SECRET
  if (!key) {
    console.log('Please set supply a faunaDB server key')
    process.exit()
  }

  const client = new faunadb.Client({
    secret: answer
  });

  createFaunaDB(key).then(() => {
    console.log('Database created')
  })
});


function createFaunaDB(key) {
  const client = new faunadb.Client({
    secret: key
  });

  /* Based on your requirements, change the schema here */
  return client.query(q.Create(q.Ref("classes"), { name: "todos" }))
    .then(()=>{
      return client.query(
        q.Create(q.Ref("indexes"), {
          name: "all_todos",
          source: q.Ref("classes/todos")
        }))
    })
    .then(console.log.bind(console))
    .catch(console.error.bind(console))
}

// Readline util
function ask(question, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question(question + '\n', function(answer) {
    rl.close();
    callback(null, answer);
  });
}
