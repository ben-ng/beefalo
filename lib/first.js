var _isNonTerminal = require('./is-non-terminal')
  , uniq = require('lodash.uniq')
  , deepeq = require('deep-equal')
  , enumSeq = require('./enumerate-sequences')
  , _nullable = require('./nullable')

function first (grammar) {
  if(grammar._firstTables) {
    return grammar._firstTables
  }

  var nullableTables = _nullable(grammar)
    , nullableNonTerminalTable = nullableTables[0]
    , table = {}
    , dirty = true
    , i = 0
    , ii = grammar.rules.length
    , j = 0
    , jj = 0
    , key
    , rule
    , lhs
    , rhs
    , toCheck = []
    , isNonTerminal = _isNonTerminal(grammar)
    , tokenIsNullable = function (token) {
        if(isNonTerminal[token]) {
          if(!nullableNonTerminalTable[grammar.nonTerminals.indexOf(token)]) {
            return false
          }
        }
        else {
          return false
        }
        return true
      }
    , nonTerminalProductionMap = {}
    , rhsArray = []
    , lhsArray = []
    , auxMap = {}

  /*
  * Unlike nullable, here the rules for sequences of grammar symbols > 1
  * require that we slice the right hand sides up, so there may not
  * always be a table lookup possible.
  */
  function _lookupOrFirst (symbols) {
    var key = symbols.join(' ')

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
    table[rhs.join(' ')] = []

    toCheck.push([lhs])
    toCheck.push(rhs)
  }

  // For every rhs, check every sequence following a nonterminal
  // We don't care about empty sequences, which are obviously nullable
  enumSeq(grammar, function (nt, seq) {
    var key

    if(seq.length) {
      key = seq.join(' ')

      // Don't add the same sequence multiple times
      if(auxMap[key] !== false) {
        toCheck.push(seq)
        auxMap[key] = false
      }
    }
  })

  // Now repeatedly recompute _first on each thing until no changes happen
  while(dirty) {
    dirty = false

    for(j=0, jj=toCheck.length; j<jj; ++j) {
      var result = uniq(_first(toCheck[j]), true)
      key = toCheck[j].join(' ')

      if(!deepeq(table[key],result)) {
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
    rhsArray.push(table[grammar.rules[j][1].join(' ')])
  }

  for(key in auxMap) {
    auxMap[key] = table[key]
  }

  grammar._firstTables = [lhsArray, rhsArray, auxMap]

  return grammar._firstTables
}

module.exports = first
