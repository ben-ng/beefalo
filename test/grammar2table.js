var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , harderGrammar = require('./harder-grammar')
  , grammar2table = require('../lib/grammar2table')
  , table2string = require('../lib/table2string')

test('grammar2table', function (t) {
  t.plan(2)

  var parseTable = grammar2table(simpleGrammar)

  console.log(table2string(parseTable))
})
