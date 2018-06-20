export default function sortDate(dateKey, order) {
  return function (a, b) {
    const timeA = new Date(a[dateKey]).getTime()
    const timeB = new Date(b[dateKey]).getTime()
    if (order === 'asc') {
      return timeA - timeB
    }
    // default 'desc' descending order
    return timeB - timeA
  }
}
