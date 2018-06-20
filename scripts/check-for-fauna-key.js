const chalk = require('chalk')
if (!process.env.FAUNADB_SECRET) {
  console.log('Please set supply a faunaDB server key')
  console.log(`
=========================

In your terminal run the following command

export FAUNADB_SECRET=abcYourKeyHere

=========================
`)
  process.exit(1)
}
