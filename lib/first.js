var _isNonTerminal = require('./is-non-terminal')
  , uniq = require('lodash.uniq')
  , deepeq = require('deep-equal')
  , _nullable = require('./nullable')

function first (grammar) {
  var nullableTables = _nullable(grammar)
    , nullableTerminalTable = nullableTables[0]
    , nullableRHSTable = nullableTables[1]
    , table = {}
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
    , tokenIsNullable = function (token) {
        if(isNonTerminal[token]) {
          if(!nullableTerminalTable[token]) {
            return false
          }
        }
        else {
          if(!nullableRHSTable[token]) {
            return false
          }
        }
        return true
      }
    , nonTerminalProductionMap = {}
    , rhsArray = []
    , lhsArray = []

  function _lookupOrFirst (symbols) {
    var key = symbols.join('')

    if(table[key] != null) {
      return table[key]
    }
    else {
      return _first(symbols)
    }
  }

  function _first (symbols) {
    var i = 0
      , ii = symbols.length
      , productions
      , symbol
      , tempSet = []

    // Epsilon? Its first set is empty
    if(ii === 0) {
      return []
    }
    // Single token?
    else if (ii === 1) {
      symbol = symbols[0]
      // A single nonterminal's first set is the union of all its productions' first sets
      if(isNonTerminal[symbol]) {
        productions = nonTerminalProductionMap[symbol]

        for(ii=productions.length; i<ii; ++i) {
          tempSet.push.apply(tempSet, _lookupOrFirst(productions[i]))
        }

        tempSet.sort()
        return tempSet
      }
      // A single terminal's first set is itself
      else {
        return [symbols[0]]
      }
    }
    // Multiple concatenated tokens? Recurse!
    else {
      // If the first token is nullable
      // take the union of all the first sets recursively
      if(tokenIsNullable(symbols[0])) {
        tempSet = _lookupOrFirst(symbols.slice(0, 1)).concat(_lookupOrFirst(symbols.slice(1)))
        tempSet.sort()
        return tempSet
      }
      // If it isn't nullable, then it's just the first set of the first symbol
      else {
        tempSet = _lookupOrFirst(symbols.slice(0, 1))
        tempSet.sort()
        return tempSet
      }
    }
  }

  // Start by setting everything in the table to empty sets
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

    table[lhs] = []
    table[rhs.join('')] = []

    toCheck.push([lhs])
    toCheck.push(rhs)
  }

  // Now repeatedly recompute _nullable on each thing until no changes happen
  while(dirty) {
    dirty = false

    for(j=0, jj=toCheck.length; j<jj; ++j) {
      var key = toCheck[j].join('')
        , result = uniq(_first(toCheck[j]), true)

      if(!deepeq(table[key],result)) {
        dirty = true
        table[key] = result
      }
    }
  }

  // Return two tables
  for(j=0, jj=grammar.terminals.length; j<jj; ++j) {
    lhsArray.push(table[grammar.nonTerminals[j]])
  }

  for(j=0, jj=grammar.rules.length; j<jj; ++j) {
    rhsArray.push(table[grammar.rules[j][1].join('')])
  }

  return [lhsArray, rhsArray]
}

module.exports = first