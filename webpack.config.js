// This is needed until netlify-lambda upgrades to webpack4
var webpack = require("./node_modules/netlify-lambda/node_modules/webpack");

/* fix for https://medium.com/@danbruder/typeerror-require-is-not-a-function-webpack-faunadb-6e785858d23b */
module.exports = {
  plugins: [
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ],
  node: {
    __dirname: true,
  }
}
