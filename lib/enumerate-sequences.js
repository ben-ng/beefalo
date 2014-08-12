var _isNonTerminal = require('./is-non-terminal')

/**
* Given a grammar, calls cb(NT, sequence, lhs, rhs) for each sequence of grammar symbols
* after a nonterminal (NT) in the right hand side of the productions
*/
function enumSequencesAfterNTs (grammar, cb) {
  var i = 0
    , ii = grammar.rules.length
    , j = 0
    , jj = 0
    , rule
    , lhs
    , rhs
    , isNonTerminal = _isNonTerminal(grammar)

  for(; i<ii; ++i) {
    rule = grammar.rules[i]
    lhs = rule[0]
    rhs = rule[1]

    // For every rhs, check every sequence following a nonterminal
    // If opts.showNullable don't care about the last symbol because the sequence after it is empty
    // and therefore obviously nullable
    for(j=0, jj=rhs.length; j<jj; ++j) {
      if(isNonTerminal[rhs[j]]) {
        cb(rhs[j], rhs.slice(j + 1, rhs.length), lhs, rhs)
      }
    }
  }
}

module.exports = enumSequencesAfterNTs
