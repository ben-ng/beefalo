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
      , productionMap: { B: 0, D: 1, H: 2, I: 3, L: 4 }
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
        , aliasMap: {
            'A,C,E,I,J': [ 'A', 'C', 'E', 'I', 'J' ]
          , B: [ 'B' ]
          , 'C,E,F,I,J': [ 'C', 'E', 'F', 'I', 'J' ]
          , D: [ 'D' ]
          , G: [ 'G' ]
          , H: [ 'H' ]
          , 'I,J,K': [ 'I', 'J', 'K' ]
          , L: [ 'L' ]
          }
        , transitions: {
            'A,C,E,I,J': [ 'T', 'B', 'R', 'D', 'a', 'C,E,F,I,J', 'b', 'I,J,K' ]
          , B: []
          , D: []
          , 'C,E,F,I,J': [ 'R', 'D', 'a', 'C,E,F,I,J', 'T', 'G', 'b', 'I,J,K' ]
          , 'I,J,K': [ 'b', 'I,J,K', 'R', 'L' ]
          , G: [ 'c', 'H' ]
          , L: []
          , H: []
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
      , productionMap: { B: 0, D: 1, E: 2 }
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
      , aliasMap: { B: [ 'B' ], D: [ 'D' ], E: [ 'E' ] }
      , initial: 'E'
      , transitions: { B: [], D: [], E: [ 'A', 'B', 'a', 'D' ] }
      })
})
