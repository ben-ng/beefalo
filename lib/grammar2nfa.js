var _isNonTerminal = require('./is-non-terminal')

// Assumes that grammar already has a starting production
// and that production is the first rule
function grammar2nfa (grammar) {
  // Create an nfa for each production
  var stateCounter = 65 // ASCII "A" for easy debugging
    , nextStateNumber
    , isNonTerminal = _isNonTerminal(grammar)
    , nfa = {
        initial: 'A'
      , accept: []
      , transitions: {}
      }
    , productionMap = {}
    , nonTerminalInitialStates = {}
    , nonTerminalStatePairs = []
    , i = 0
    , ii = grammar.rules.length
    , j = 0
    , jj = 0
    , initialStates
    , transitions
    , tuple
    , rule
    , tokens
    , nonTerminal

  // The first pass makes what is really a set of NFAs
  for(; i<ii; ++i) {
    rule = grammar.rules[i]
    nonTerminal = rule[0]
    tokens = rule[1]

    if(tokens.length === 0) {
      // Save the initial state in the map
      if(nonTerminalInitialStates[nonTerminal] == null) {
        nonTerminalInitialStates[nonTerminal] = [String.fromCharCode(stateCounter)]
      }
      else {
        nonTerminalInitialStates[nonTerminal].push(String.fromCharCode(stateCounter))
      }

      nfa.transitions[String.fromCharCode(stateCounter)] = []
      nfa.accept.push(String.fromCharCode(stateCounter))

      productionMap[String.fromCharCode(stateCounter)] = i

      stateCounter = stateCounter + 1
    }
    else {
      // Save the initial state in the map
      if(nonTerminalInitialStates[nonTerminal] == null) {
        nonTerminalInitialStates[nonTerminal] = [String.fromCharCode(stateCounter)]
      }
      else {
        nonTerminalInitialStates[nonTerminal].push(String.fromCharCode(stateCounter))
      }

      // For each token in the right hand side, add a transition
      for(j=0, jj=tokens.length; j<jj; ++j) {
        nextStateNumber = stateCounter + 1
        nfa.transitions[String.fromCharCode(stateCounter)] = [tokens[j], String.fromCharCode(nextStateNumber)]

        if(isNonTerminal[tokens[j]]) {
          nonTerminalStatePairs.push([String.fromCharCode(stateCounter), tokens[j]])
        }

        stateCounter = nextStateNumber
      }

      nfa.transitions[String.fromCharCode(stateCounter)] = []
      nfa.accept.push(String.fromCharCode(stateCounter))

      productionMap[String.fromCharCode(stateCounter)] = i

      stateCounter++
    }
  }

  // this second pass adds epsilon transitions between the nfas
  for(i=0, ii=nonTerminalStatePairs.length; i<ii; ++i) {
    tuple = nonTerminalStatePairs[i]
    transitions = nfa.transitions[tuple[0]]

    initialStates = nonTerminalInitialStates[tuple[1]]

    for(j=0, jj=initialStates.length; j<jj; ++j) {
      transitions.push('\0', initialStates[j])
    }
  }

  nfa.productionMap = productionMap

  return nfa
}

module.exports = grammar2nfa
