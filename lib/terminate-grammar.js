
/**
* Given a grammar with start state S, adds the
* production S' -> S $ where $ is EOF (-1) and S' is the new initial state
*/
function terminateGrammar (grammar) {
  var newState = grammar.rules[0][0]+'\''
  grammar = JSON.parse(JSON.stringify(grammar))
  grammar.rules.unshift([newState, [grammar.rules[0][0], -1]])
  grammar.nonTerminals.push(newState)
  grammar.terminals.push(-1)

  return grammar
}

module.exports = terminateGrammar
