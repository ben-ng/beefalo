var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , harderGrammar = require('./harder-grammar')
  , first = require('../lib/first')

test('first', function (t) {
  t.plan(3)

  var firstTable = first(simpleGrammar)
    , specialGrammar

  t.deepEqual(firstTable
    , [
        [ [ 'a', 'b' ], [ 'a', 'b' ], [ 'b' ] ]
      , [ [ 'a', 'b' ], [ 'b' ], [ 'a' ], [], [ 'b' ] ]
      , {c: ['c']} ]
    , 'Should return three first tables, one for NTs, one for RHS, and one for every sequence after a NT')

  firstTable = first(harderGrammar)

  t.deepEqual(firstTable
  , [ [ [ 'a', 'b' ],
      [ 'a', 'b' ],
      [ 'a', 'b' ],
      [ 'a', 'b' ],
      [ 'a', 'b' ] ]
  , [ [ 'a', 'b' ],
      [ 'a', 'b' ],
      [ 'a', 'b' ],
      [ 'a' ],
      [ 'a', 'b' ],
      [ 'b' ],
      [ 'a', 'b' ],
      [ 'a' ],
      [ 'b' ] ]
  , { A: [ 'a', 'b' ], 'A C': [ 'a', 'b' ], B: [ 'a', 'b' ], 'B C': [ 'a', 'b' ], C: [ 'a', 'b' ] } ]
  , 'Should return two first tables, one for NTs, one for RHS, and one for every sequence after a NT')

  specialGrammar = {
    terminals: ['a', 'b', 'c', 'd']
  , nonTerminals: ['A', 'B', 'C', 'D']
  , rules: [
      ['A', ['B', 'C']]
    , ['B', []] // B is nullable
    , ['C', ['c']] // But C is not nullable
    , ['D', ['d']] // D is not nullable, but it shouldn't matter
    ]
  }

  firstTable = first(specialGrammar)

  t.deepEqual(firstTable
    , [ [ [ 'c' ], [], [ 'c' ], [ 'd' ] ],
      [ [ 'c' ], [], [ 'c' ], [ 'd' ] ],
      { C: [ 'c' ] } ]
    , 'Expect A, C, and D to have first sets')

})
