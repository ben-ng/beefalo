var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , nullable = require('../lib/nullable')

test('nullable', function (t) {
  t.plan(1)

  var nullableTable = nullable(simpleGrammar)

  t.deepEqual(nullableTable
    , [ [ true, true, true ], [ true, true, false, true, false ] ]
    , 'Should return two nullable tables, one for NTs and one for RHS')
})
