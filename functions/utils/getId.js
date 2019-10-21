
module.exports = function getId(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}
