var _isNonTerminal = require('./is-non-terminal')

// Assumes that grammar already has a starting production
// and that production is the first rule
function grammar2nfa (grammar) {
  // Create an nfa for each production
  var stateCounter = 0
    , nextStateNumber
    , isNonTerminal = _isNonTerminal(grammar)
    , nfa = {
        initial: 0
      , accept: []
      , transitions: {}
      }
    , nonTerminalInitialStates = {}
    , nonTerminalStatePairs = []
    , i = 0
    , ii = grammar.rules.length
    , j = 0
    , jj = 0
    , initialStates
    , transitions
    , tuple
    , acceptState
    , rule
    , tokens
    , nonTerminal

  for(j=0, jj=grammar.terminals.length; j<jj; j++) {
    if(isNonTerminal[grammar.terminals[j]] != null) {
      return new Error('A token is in both the terminal and nonterminal definitions')
    }

    isNonTerminal[grammar.terminals[j]] = false
  }

  // The first pass makes what is really a set of NFAs
  for(; i<ii; ++i) {
    rule = grammar.rules[i]
    nonTerminal = rule[0]
    tokens = rule[1]

    acceptState = nonTerminal + '->' + tokens.join('')

    if(tokens.length === 0) {
      // Save the initial state in the map
      if(nonTerminalInitialStates[nonTerminal] == null) {
        nonTerminalInitialStates[nonTerminal] = [acceptState]
      }
      else {
        nonTerminalInitialStates[nonTerminal].push(acceptState)
      }

      nfa.transitions[acceptState] = []
      nfa.accept.push(acceptState)
    }
    else {
      // Save the initial state in the map
      if(nonTerminalInitialStates[nonTerminal] == null) {
        nonTerminalInitialStates[nonTerminal] = [stateCounter]
      }
      else {
        nonTerminalInitialStates[nonTerminal].push(stateCounter)
      }

      // For each token in the right hand side, add a transition
      for(j=0, jj=tokens.length-1; j<jj; ++j) {
        nextStateNumber = stateCounter + 1
        nfa.transitions[stateCounter] = [tokens[j], nextStateNumber]

        if(isNonTerminal[tokens[j]]) {
          nonTerminalStatePairs.push([stateCounter, tokens[j]])
        }

        stateCounter = nextStateNumber
      }

      nfa.transitions[stateCounter] = [tokens[j], acceptState]

      if(isNonTerminal[tokens[j]]) {
        nonTerminalStatePairs.push([stateCounter, tokens[j]])
      }

      nfa.transitions[acceptState] = []
      nfa.accept.push(acceptState)

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

  return nfa
}

module.exports = grammar2nfa
