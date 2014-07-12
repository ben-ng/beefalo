var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , harderGrammar = require('./harder-grammar')
  , nullable = require('../lib/nullable')

test('nullable', function (t) {
  t.plan(2)

  var nullableTable = nullable(simpleGrammar)

  t.deepEqual(nullableTable
    , [ [ true, true, true ], [ true, true, false, true, false ] ]
    , 'Should return two nullable tables, one for NTs and one for RHS')

  nullableTable = nullable(harderGrammar)

  t.deepEqual(nullableTable
    , [ [ false, false, false, false, false ]
    , [ false, false, false, false, false, false, false, false, false ] ]
    , 'Should return two nullable tables, one for NTs and one for RHS, all false')
})
