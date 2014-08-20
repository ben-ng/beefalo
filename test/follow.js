var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , harderGrammar = require('./harder-grammar')
  , follow = require('../lib/follow')
  , terminateGrammar = require('../lib/terminate-grammar')

test('follow', function (t) {
  t.plan(3)

  var savedGrammar = terminateGrammar(simpleGrammar)
    , followTable = follow(savedGrammar)

  t.deepEqual(followTable
    , { R: [ -1, 'c' ], T: [ -1, 'c' ], 'T\'': [ -1 ] }
    , 'Should return one follow table for the simple grammar')

  t.strictEqual(follow(savedGrammar)
    , followTable
    , 'Should cache the computed follow table')

  followTable = follow(terminateGrammar(harderGrammar))

  t.deepEqual(followTable
    , { A: [ -1, 'a', 'b' ]
      , B: [ -1, 'a', 'b' ]
      , C: [ -1, 'a', 'b' ]
      , N: [ -1 ], 'T\'': [ -1 ] }
    , 'Should return one follow table for the harder grammar')

})
