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
        initial: 0,
        accept: [ 'T\'->T', 'T->R', 'T->aTc', 'R->', 'R->bR' ],
        transitions:
        {
          '0': [ 'T', 'T\'->T', '\u0000', 1, '\u0000', 2 ],
          '1': [ 'R', 'T->R', '\u0000', 'R->', '\u0000', 5 ],
          '2': [ 'a', 3 ],
          '3': [ 'T', 4, '\u0000', 1, '\u0000', 2 ],
          '4': [ 'c', 'T->aTc' ],
          '5': [ 'b', 6 ],
          '6': [ 'R', 'R->bR', '\u0000', 'R->', '\u0000', 5 ],
          'T\'->T': [],
          'T->R': [],
          'T->aTc': [],
          'R->': [],
          'R->bR': []
        }
      }, 'NFA should match expected value')

  t.deepEqual(new Fragment(nfa).toDfa(',')
      , {
          accept: [ 'T\'->T', 'T->R', 'R->', 'R->', 'R->bR', 'T->aTc' ]
        , initial: 'R->'
        , transitions: {
            4: [ 'c', 'T->aTc' ]
          , 'R->': [ 'R', 'T->R', 'a', 'R->', 'T', '4', 'b', 'R->' ]
          , 'R->bR': []
          , 'T\'->T': []
          , 'T->R': []
          , 'T->aTc': []
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
        accept: [ 'S->A', 'A->a', 'A->' ]
      , initial: 0
      , transitions: {
          0: [ 'A', 'S->A', '\x00', 1, '\x00', 'A->' ]
        , 1: [ 'a', 'A->a' ], 'A->': [], 'A->a': [], 'S->A': []
        }
      }, 'NFA should match expected value')

  t.deepEqual(new Fragment(nfa).toDfa(',')
    , {
        initial: 'A->',
        accept: [ 'S->A', 'A->a' ],
        transitions: {
          'A->': [ 'A', 'S->A', 'a', 'A->a' ],
          'A->a': [],
          'S->A': []
        }
      })
})
