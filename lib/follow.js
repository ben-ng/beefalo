var _nullable = require('./nullable')
  , _first = require('./first')
  , enumSeq = require('./enumerate-sequences')
  , uniq = require('lodash.uniq')

function follow (grammar) {
  if(grammar._followTable) {
    return grammar._followTable
  }

  var followMap = {}
    , auxNullableTable = _nullable(grammar)[2]
    , auxFirstTable = _first(grammar)[2]
    , constraints = []
    , dirty = true
    , i = 0
    , ii = 0

  /**
  * Constraints is an array of tuples
  * A tuple [N, M] means N \subseteq M
  * M must be a string, which represents the set FOLLOW(M)
  * N can be one of two things
  * - If N is a string K, then N is FOLLOW(K) and FOLLOW(K) \subseteq FOLLOW(M)
  * - If N is an array, then N is a set of terminals and FOLLOW(M)
  *   is initialized with N's contents
  */

  // For each nonterminal N, locate all occurences of N on the RHS of productions
  // M is the left hand side nonterminal of the production
  enumSeq(grammar, function (N, seq, M) {
    // If seq is EOF, special case by initializing with the -1 EOF character
    if(seq.length === 1 && seq[0] === -1) {
      constraints.push([[-1], N])
      followMap[N] = []
    }
    // Everything else we handle using the first and nullable tables
    else {
      var seqkey = seq.join(' ')

      // Let seq be the rest of the right hand side after the occurence of N
      if(seq.length) {
        constraints.push([auxFirstTable[seqkey], N])
        followMap[N] = []
      }

      // An empty seq is clearly nullable, otherwise look it up
      if(!seq.length || auxNullableTable[seqkey]) {
        constraints.push([M, N])
        followMap[M] = []
        followMap[N] = []
      }
    }
  })

  // Solve the constraints with fixed point iteration
  while(dirty) {
    dirty = false

    for(i=0, ii=constraints.length; i<ii; ++i) {
      var constraint = constraints[i]
        , lhs = constraint[0]
        , rhs = constraint[1]
        , current = followMap[rhs]
        , currentLength = followMap[rhs].length
        , temp

      if(typeof lhs == 'string') {
        temp = current.concat(followMap[lhs])
        temp.sort()
        followMap[rhs] = uniq(temp, true)
      }
      else {
        temp = current.concat(lhs)
        temp.sort()
        followMap[rhs] = uniq(temp, true)
      }

      if(followMap[rhs].length !== currentLength) {
        dirty = true
      }
    }
  }

  grammar._followTable = followMap

  return grammar._followTable
}

module.exports = follow
