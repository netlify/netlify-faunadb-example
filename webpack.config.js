var webpack = require("webpack");

/* fix for https://medium.com/@danbruder/typeerror-require-is-not-a-function-webpack-faunadb-6e785858d23b */
module.exports = {
  plugins: [
    new webpack.DefinePlugin({ "global.GENTLY": false })
  ],
  node: {
    __dirname: true,
  }
}
