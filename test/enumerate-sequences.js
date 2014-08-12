var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , harderGrammar = require('./harder-grammar')
  , enumSeq = require('../lib/enumerate-sequences')

test('enumerate sequences after NTs', function (t) {
  t.plan(2)

  var results = []

  enumSeq(simpleGrammar, function () {
    results.push(Array.prototype.slice.call(arguments))
  })

  t.deepEqual(results
            , [
                  [ 'T', [], 'T\'', [ 'T' ] ]
                , [ 'R', [], 'T', [ 'R' ] ]
                , [ 'T', [ 'c' ], 'T', [ 'a', 'T', 'c' ] ]
                , [ 'R', [], 'R', [ 'b', 'R' ] ]
              ]
            , 'Should have enumerated simple grammar correctly')

  results = []

  enumSeq(harderGrammar, function () {
    results.push(Array.prototype.slice.call(arguments))
  })

  t.deepEqual(results
            , [
                [ 'N', [], 'T\'', [ 'N' ] ]
              , [ 'A', [ 'B' ], 'N', [ 'A', 'B' ] ]
              , [ 'B', [], 'N', [ 'A', 'B' ] ]
              , [ 'B', [ 'A' ], 'N', [ 'B', 'A' ] ]
              , [ 'A', [], 'N', [ 'B', 'A' ] ]
              , [ 'C', [ 'A', 'C' ], 'A', [ 'C', 'A', 'C' ] ]
              , [ 'A', [ 'C' ], 'A', [ 'C', 'A', 'C' ] ]
              , [ 'C', [], 'A', [ 'C', 'A', 'C' ] ]
              , [ 'C', [ 'B', 'C' ], 'B', [ 'C', 'B', 'C' ] ]
              , [ 'B', [ 'C' ], 'B', [ 'C', 'B', 'C' ] ]
              , [ 'C', [], 'B', [ 'C', 'B', 'C' ] ] ]
            , 'Should have enumerated harder grammar correctly')

})
