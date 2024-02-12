const qs = require('qs')

const parseQuery = (query) => qs.parse(query)
module.exports = {parseQuery}