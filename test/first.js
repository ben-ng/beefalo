var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , first = require('../lib/first')

test('first', function (t) {
  t.plan(1)

  var firstTable = first(simpleGrammar)

  t.deepEqual(firstTable
    , [
        [ [ 'a', 'b' ], [ 'a', 'b' ], [ 'b' ] ]
      , [ [ 'a', 'b' ], [ 'b' ], [ 'a' ], [], [ 'b' ] ] ]
    , 'Should return two first tables, one for NTs and one for RHS')

})
