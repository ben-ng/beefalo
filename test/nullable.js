var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , harderGrammar = require('./harder-grammar')
  , nullable = require('../lib/nullable')

test('nullable', function (t) {
  t.plan(2)

  var nullableTable = nullable(simpleGrammar)

  t.deepEqual(nullableTable
    , [ [ true, true, true ], [ true, true, false, true, false ], {c: false} ]
    , 'Should return three nullable tables, one for NTs, one for RHS, one for every sequence after a NT')

  nullableTable = nullable(harderGrammar)

  t.deepEqual(nullableTable
    , [ [ false, false, false, false, false ]
    , [ false, false, false, false, false, false, false, false, false ]
    , {A: false, 'A C': false, B: false, 'B C': false, C: false} ]
    , 'Should return two nullable tables, one for NTs, one for RHS, ' +
      'one for every sequence after a NT, all false')
})
