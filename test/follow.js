var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , harderGrammar = require('./harder-grammar')
  , follow = require('../lib/follow')

test('follow', function (t) {
  t.plan(2)

  var firstTable = follow(simpleGrammar)

  t.deepEqual(firstTable
    , { R: [ -1, 'c' ], T: [ -1, 'c' ], 'T\'': [ -1 ] }
    , 'Should return one follow table for the simple grammar')

  firstTable = follow(harderGrammar)

  t.deepEqual(firstTable
    , { A: [ -1, 'a', 'b' ]
      , B: [ -1, 'a', 'b' ]
      , C: [ -1, 'a', 'b' ]
      , N: [ -1 ], 'T\'': [ -1 ] }
    , 'Should return one follow table for the harder grammar')

})
