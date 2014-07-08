var _isNonTerminal = require('./is-non-terminal')

function nullable (grammar) {
  var table = {}
    , dirty = true
    , i = 0
    , ii = grammar.rules.length
    , j = 0
    , jj = 0
    , rule
    , lhs
    , rhs
    , toCheck = []
    , isNonTerminal = _isNonTerminal(grammar)
    , nonTerminalProductionMap = {}
    , rhsArray = []
    , lhsArray = []

  function _nullable (symbols) {
    var i = 0
      , ii = symbols.length
      , productions
      , symbol

    // Epsilon? It's nullable
    if(ii === 0) {
      return true
    }
    // Single token?
    else if (ii === 1) {
      symbol = symbols[0]
      // A single nonterminal is nullable if any of its productions are nullable
      if(isNonTerminal[symbol]) {
        productions = nonTerminalProductionMap[symbol]

        for(ii=productions.length; i<ii; ++i) {
          if(_nullable(productions[i])) {
            return true
          }
        }

        return false
      }
      // A single terminal is clearly not nullable
      else {
        return false
      }
    }
    // Multiple concatenated tokens are nullable only if ALL of them are nullable
    else {
      for(; i<ii; ++i) {
        if(!_nullable(symbols[i])) {
          return false
        }
      }

      return true
    }
  }

  // Start by setting everything in the table to false
  for(; i<ii; ++i) {
    rule = grammar.rules[i]
    lhs = rule[0]
    rhs = rule[1]

    if(nonTerminalProductionMap[lhs] == null) {
      nonTerminalProductionMap[lhs] = [rhs]
    }
    else {
      nonTerminalProductionMap[lhs].push(rhs)
    }

    table[lhs] = false
    table[rhs.join('')] = false

    toCheck.push([lhs])
    toCheck.push(rhs)
  }

  // Now repeatedly recompute _nullable on each thing until no changes happen
  while(dirty) {
    dirty = false

    for(j=0, jj=toCheck.length; j<jj; ++j) {
      var key = toCheck[j].join('')
        , result = _nullable(toCheck[j])

      if(table[key] != result) {
        dirty = true
        table[key] = result
      }
    }
  }

  // Return two tables
  for(j=0, jj=grammar.terminals.length; j<jj; ++j) {
    lhsArray.push(table[grammar.nonTerminals[0]])
  }

  for(j=0, jj=grammar.rules.length; j<jj; ++j) {
    rhsArray.push(table[grammar.rules[j][1].join('')])
  }

  return [lhsArray, rhsArray]
}

module.exports = nullable