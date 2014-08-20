/**
* Given an NFA, generates a parse table
*/
var Fragment = require('finite-automata')
  , _isNonTerminal = require('./is-non-terminal')
  , _follow = require('./follow')
  , grammar2nfa = require('./grammar2nfa')
  , terminateGrammar = require('./terminate-grammar')

function grammar2table (grammar) {

  grammar = terminateGrammar(grammar)

  var delim = ','
    , state
    , states
    , i = 0
    , ii = 0
    , j = 0
    , jj = 0
    , k
    , nfa = grammar2nfa(grammar)
    , isNonTerminal = _isNonTerminal(grammar)
    , follow = _follow(grammar)
    , production
    , dfa
    , transitions
    , symbol
    , symbols
    , destination
    , table = {}
    , row = {}
    , startSymbol = grammar.rules[0][0]

  dfa = new Fragment(nfa).toDfa(delim)

  // Initialize the table

  for(i=0, ii=grammar.terminals.length; i<ii; ++i) {
    row[grammar.terminals[i]] = []
  }

  for(i=0, ii=grammar.nonTerminals.length; i<ii; ++i) {
    if(grammar.nonTerminals[i] != startSymbol) {
      row[grammar.nonTerminals[i]] = []
    }
  }

  for(state in dfa.transitions) {
    table[state] = JSON.parse(JSON.stringify(row))
  }

  for(state in dfa.transitions) {
    transitions = dfa.transitions[state]

    for(i=0, ii=transitions.length; i<ii; i+=2) {
      symbol = transitions[i]
      destination = transitions[i+1]

      if(isNonTerminal[symbol]) {
        table[state][symbol].push(['g', destination])
      }
      else {
        table[state][symbol].push(['s', destination])
      }
    }
  }

  // Find the productions associated with the dfa accept states
  for(k in dfa.aliasMap) {
    destination = dfa.aliasMap[k]

    // If this compound state was mapped to an accept state
    if(dfa.accept.indexOf(destination) > -1) {
      // Iterate through all the states that were merged into it
      states = k.split(delim)

      for(i=0, ii=states.length; i<ii; ++i) {
        state = states[i]

        // Look up this state in our known productions map
        production = productions[state]

        // If this state was in fact a production
        if(production) {
          // Is this production the one we added? (The one with the terminating $)
          if(production[0] == grammar.rules[0][0]) {
            // Conflicts with accept? accept always wins!
            table[destination][-1] = ['a']
          }
          else {
            // Find all follow symbols for the LHS NT of the production
            symbols = follow[production[0]]

            for(j=0, jj=symbols.length; j<jj; ++j) {
              symbol = symbols[j]

              // Add a reduce
              table[destination][symbol].push(['r', state])
            }
          }
        }
      }
    }
  }

  return table
}

module.exports = grammar2table
