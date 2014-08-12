var _isNonTerminal = require('./is-non-terminal')

function nullable (grammar) {
  var table = {}
    , dirty = true
    , i = 0
    , ii = grammar.rules.length
    , j = 0
    , jj = 0
    , rule
    , key
    , seq
    , lhs
    , rhs
    , toCheck = []
    , isNonTerminal = _isNonTerminal(grammar)
    , nonTerminalProductionMap = {}
    , rhsArray = []
    , lhsArray = []
    , auxMap = {}

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
          if(table[productions[i]]) {
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
        if(!table[symbols[i]]) {
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

    // For every rhs, check every sequence following a nonterminal
    // We don't care about the last symbol because the sequence after it is empty
    // and therefore obviously nullable
    for(j=1, jj=rhs.length-1; j<jj; ++j) {
      if(isNonTerminal[rhs[j]]) {
        seq = rhs.slice(j + 1, rhs.length)
        key = seq.join('')

        // Don't add the same sequence multiple times
        if(auxMap[key] !== false) {
          toCheck.push(seq)
          auxMap[key] = false
        }
      }
    }
  }

  // Now repeatedly recompute _nullable on each thing until no changes happen
  while(dirty) {
    dirty = false

    for(j=0, jj=toCheck.length; j<jj; ++j) {
      var result = _nullable(toCheck[j])

      key = toCheck[j].join('')

      if(table[key] != result) {
        dirty = true
        table[key] = result
      }
    }
  }

  // Return two tables
  for(j=0, jj=grammar.nonTerminals.length; j<jj; ++j) {
    lhsArray.push(table[grammar.nonTerminals[j]])
  }

  for(j=0, jj=grammar.rules.length; j<jj; ++j) {
    rhsArray.push(table[grammar.rules[j][1].join('')])
  }

  for(key in auxMap) {
    auxMap[key] = table[key]
  }

  return [lhsArray, rhsArray, auxMap]
}

module.exports = nullable
