/**
* Creates a dictionary that maps strings to booleans
*/

function _isNonTerminal (grammar) {
  if(grammar._isNonTerminalMap != null) {
    return grammar._isNonTerminalMap
  }

  var isNonTerminal = {}
    , j=0
    , jj=grammar.nonTerminals.length

  for(; j<jj; j++) {
    isNonTerminal[grammar.nonTerminals[j]] = true
  }

  grammar._isNonTerminalMap = isNonTerminal

  return isNonTerminal
}

module.exports = _isNonTerminal
