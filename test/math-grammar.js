var Terminals
  , NonTerminals
  , Rules

NonTerminals = [
  'Statement'
, 'Expression'
]

Terminals = [
  'Identifier'
, 'NumberLiteral'
, 'VectorLiteral'
, 'MatrixLiteral'
, 'Dot'
, 'Add'
, 'Divide'
, 'Subtract'
, 'AssignmentOperator'
]

Rules = [
  ['Statement', ['Identifier', 'AssignmentOperator', 'Expression']]
, ['Statement', ['Expression']]
, ['Expression', ['Number']]
, ['Expression', ['Vector']]
, ['Expression', ['Matrix']]

  // Simple arithmetic
, ['Number', ['NumberLiteral']]
, ['Number', ['Number', 'AddOperator', 'Number']]
, ['Number', ['Number', 'DivideOperator', 'Number']]
, ['Number', ['Number', 'SubtractOperator', 'Number']]
, ['Number', ['Number', 'DotOperator', 'Number']]

  // Vector operations
, ['Vector', ['VectorLiteral']]
, ['Vector', ['Number', 'DotOperator', 'Vector']]
, ['Vector', ['Vector', 'DotOperator', 'Number']]
, ['Vector', ['Vector', 'DotOperator', 'Vector']]
, ['Vector', ['Matrix', 'DotOperator', 'Vector']]

  // Matrix operations
, ['Matrix', ['MatrixLiteral']]
, ['Matrix', ['Number', 'DotOperator', 'Matrix']]
, ['Matrix', ['Matrix', 'DotOperator', 'Matrix']]
]

module.exports = {
  terminals: Terminals
, nonTerminals: NonTerminals
, rules: Rules
}
