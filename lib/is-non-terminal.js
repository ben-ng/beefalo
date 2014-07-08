function _isNonTerminal (grammar) {
  if(grammar.isNonTerminal != null) {
    return grammar.isNonTerminal
  }

  var isNonTerminal = {}
    , j=0
    , jj=grammar.nonTerminals.length

  for(; j<jj; j++) {
    isNonTerminal[grammar.nonTerminals[j]] = true
  }

  grammar.isNonTerminal = isNonTerminal

  return isNonTerminal
}

module.exports = _isNonTerminal
