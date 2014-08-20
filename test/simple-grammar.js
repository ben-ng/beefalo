var Terminals
  , NonTerminals
  , Rules

NonTerminals = [
  'T\''
, 'T'
, 'R'
]

Terminals = [
  'a'
, 'b'
, 'c'
, '-1'
]

Rules = [
  ['T\'', ['T']]
, ['T', ['R']]
, ['T', ['a', 'T', 'c']]
, ['R', []]
, ['R', ['b', 'R']]
]

module.exports = {
  terminals: Terminals
, nonTerminals: NonTerminals
, rules: Rules
}
