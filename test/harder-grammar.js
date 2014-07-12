var Terminals
  , NonTerminals
  , Rules

NonTerminals = [
  'T\''
, 'N'
, 'A'
, 'B'
, 'C'
]

Terminals = [
  'a'
, 'b'
]

Rules = [
  ['T\'', ['N']]
, ['N', ['A', 'B']]
, ['N', ['B', 'A']]
, ['A', ['a']]
, ['A', ['C', 'A', 'C']]
, ['B', ['b']]
, ['B', ['C', 'B', 'C']]
, ['C', ['a']]
, ['C', ['b']]
]

module.exports = {
  terminals: Terminals
, nonTerminals: NonTerminals
, rules: Rules
}
