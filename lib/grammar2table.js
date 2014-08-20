/**
* Given an NFA, generates a parse table
*/
var Fragment = require('finite-automata')
  , _isNonTerminal = require('./is-non-terminal')
  , _follow = require('./follow')
  , grammar2nfa = require('./grammar2nfa')
  , terminate = require('./terminate-grammar')

function grammar2table (grammar) {

  var delim = ','
    , state
    , i = 0
    , ii = 0
    , j = 0
    , jj = 0
    , k
    , nfa = grammar2nfa(grammar)
    , isNonTerminal = _isNonTerminal(grammar)
    , follow = _follow(terminate(grammar))
    , productionIndex
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

  for(i=0, ii=grammar.terminals.length; i<ii; ++i) {
    row[grammar.terminals[i]] = []
  }

  for(i=0, ii=grammar.nonTerminals.length; i<ii; ++i) {
    if(grammar.nonTerminals[i] != startSymbol) {
      row[grammar.nonTerminals[i]] = []
    }
  }

  for(state in dfa.transitions) {
    table[dfa.aliasMap[state].join(',')] = JSON.parse(JSON.stringify(row))
  }

  for(state in dfa.transitions) {
    transitions = dfa.transitions[state]

    for(i=0, ii=transitions.length; i<ii; i+=2) {
      symbol = transitions[i]
      destination = transitions[i+1]

      if(isNonTerminal[symbol]) {
        table[dfa.aliasMap[state].join(',')][symbol].push(['g', destination])
      }
      else {
        table[dfa.aliasMap[state].join(',')][symbol].push(['s', destination])
      }
    }
  }

  // Iterate through the minimal dfa's states
  for(k in dfa.transitions) {
    // Break compound states into their original NFA states
    destination = dfa.aliasMap[k]

    for(i=0, ii=destination.length; i<ii; ++i) {
      // If this compound state was mapped to an accept state
      productionIndex = nfa.productionMap[destination[i]]

      // If this state was in fact a production
      if(productionIndex != null) {
        // Is this production the first one? Then it is the terminating one by convention
        if(productionIndex === 0) {
          // No conflicts are allowed, we will always accept
          table[destination][-1] = [['a']]
        }
        else {
          production = grammar.rules[productionIndex]

          // Find all follow symbols for the LHS NT of the production
          symbols = follow[production[0]]

          for(j=0, jj=symbols.length; j<jj; ++j) {
            symbol = symbols[j]

            // Add a reduce
            table[destination.join(',')][symbol].push(['r', productionIndex])
          }
        }
      }
    }
  }


  return table
}

module.exports = grammar2table
