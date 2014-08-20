var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , harderGrammar = require('./harder-grammar')
  , nullable = require('../lib/nullable')

test('nullable', function (t) {
  t.plan(3)

  var nullableTable = nullable(simpleGrammar)
    , specialGrammar

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

  specialGrammar = {
    nonTerminals: ['T', 'A', 'B', 'C']
  , terminals: ['c']
  , rules: [
      ['T', ['A', 'B']] // Nullable
    , ['T', ['A', 'B', 'C']] // Not Nullable
    , ['A', []]
    , ['B', []]
    , ['C', ['c']]
    ]
  }

  nullableTable = nullable(specialGrammar)

  t.deepEqual(nullableTable
    , [ [ false, true, true, false ],
      [ true, false, true, true, false ],
      { B: true, 'B C': false, C: false } ]
    , 'Should know concatenated nullable tokens are still nullable')
})
