var test = require('tape')
  , grammar2nfa = require('../lib/grammar2nfa')

test('errors', function (t) {
  t.plan(1)

  var badGrammar = {
        terminals: ['A']
      , nonTerminals: ['A']
      , rules: []
      }
    , expected = 'A token is in both the terminal and nonterminal definitions'

  t.ok(grammar2nfa(badGrammar).toString().indexOf(expected)>-1
    , 'Should error if a token is both a NT and T')
})
