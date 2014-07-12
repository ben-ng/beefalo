var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , harderGrammar = require('./harder-grammar')
  , first = require('../lib/first')

test('first', function (t) {
  t.plan(2)

  var firstTable = first(simpleGrammar)

  t.deepEqual(firstTable
    , [
        [ [ 'a', 'b' ], [ 'a', 'b' ], [ 'b' ] ]
      , [ [ 'a', 'b' ], [ 'b' ], [ 'a' ], [], [ 'b' ] ] ]
    , 'Should return two first tables, one for NTs and one for RHS')

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
      [ 'b' ] ] ]
  , 'Should return two first tables, one for NTs and one for RHS')

})
