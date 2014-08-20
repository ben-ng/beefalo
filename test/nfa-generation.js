var test = require('tape')
  , Fragment = require('finite-automata')
  , simpleGrammar = require('./simple-grammar')
  , grammar2nfa = require('../lib/grammar2nfa')

test('nfa generation', function (t) {
  t.plan(4)

  var nfa = grammar2nfa(simpleGrammar)
    , specialGrammar

  t.deepEqual(nfa
    , {
        accept: [ 'B', 'D', 'H', 'I', 'L' ]
      , initial: 'A'
      , transitions: {
          A: [ 'T', 'B', '\x00', 'C', '\x00', 'E' ]
        , B: []
        , C: [ 'R', 'D', '\x00', 'I', '\x00', 'J' ]
        , D: []
        , E: [ 'a', 'F' ]
        , F: [ 'T', 'G', '\x00', 'C', '\x00', 'E' ]
        , G: [ 'c', 'H' ]
        , H: []
        , I: []
        , J: [ 'b', 'K' ]
        , K: [ 'R', 'L', '\x00', 'I', '\x00', 'J' ]
        , L: []
        }
      }, 'NFA should match expected value')

  t.deepEqual(new Fragment(nfa).toDfa(',')
      , {
          accept: [ 'B', 'D', 'C,E,F,I,J', 'I,J,K', 'L', 'H' ]
        , initial: 'A,C,E,I,J'
        , transitions: {
            'A,C,E,I,J': [ 'T', 'B', 'R', 'D', 'a', 'C,E,F,I,J', 'b', 'I,J,K' ]
          , B: [], 'C,E,F,I,J': [ 'R', 'D', 'a', 'C,E,F,I,J', 'T', 'G', 'b', 'I,J,K' ]
          , D: []
          , G: [ 'c', 'H' ]
          , H: []
          , 'I,J,K': [ 'b', 'I,J,K', 'R', 'L' ]
          , L: []
          }
        }, 'DFA should match expected LR table')

  // This just hits a part of grammar2nfa to get 100% coverage
  // Note the empty production A-> after the non-empty production A->a
  specialGrammar = {
    nonTerminals: ['S', 'A']
  , terminals: ['a']
  , rules: [
      ['S', ['A']]
    , ['A', ['a']]
    , ['A', []]
    ]
  }

  nfa = grammar2nfa(specialGrammar)

  t.deepEqual(nfa
    , {
        accept: [ 'B', 'D', 'E' ]
      , initial: 'A'
      , transitions: {
          A: [ 'A', 'B', '\x00', 'C', '\x00', 'E' ]
        , B: []
        , C: [ 'a', 'D' ]
        , D: []
        , E: []
        }
      }, 'NFA should match expected value')

  t.deepEqual(new Fragment(nfa).toDfa(',')
    , {
        accept: [ 'B', 'D' ]
      , initial: 'E'
      , transitions: { B: [], D: [], E: [ 'A', 'B', 'a', 'D' ] }
      })
})
