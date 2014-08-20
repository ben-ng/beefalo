var CliTable = require('cli-table')
  , keys = require('lodash.keys')
  , values = require('lodash.values')

function table2string(data) {
  var firstRow = data[keys(data)[0]]
    , headers = [''].concat(keys(firstRow))
    , k
    , o = {}
    , toPush = []
    , i = 0
    , ii
    , ri
    , t
    , tl
    , w
    , v
    , colWidths = new Array(headers.length + 1)
    , table

  colWidths[0] = 0

  for(k in data) {
    o = {}
    v = values(data[k])
    o[k] = v

    for(i=0, ii=v.length; i<ii; ++i) {
      ri = i + 1
      t = JSON.stringify(v[i])
      w = colWidths[ri]

      tl = t.length + 2
      if(!w || w < tl) {
        colWidths[ri] = tl
      }

      v[i] = t
    }

    tl = k.length + 2
    if(tl > colWidths[0]) {
      colWidths[0] = tl
    }

    toPush.push(o)
  }

  table = new CliTable({
    head: headers
  , colWidths: colWidths
  })

  table.push.apply(table, toPush)

  return table.toString()
}

module.exports = table2string
