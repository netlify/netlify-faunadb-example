
export default function getId(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0]
}
