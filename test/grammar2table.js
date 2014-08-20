var test = require('tape')
  , simpleGrammar = require('./simple-grammar')
  , grammar2table = require('../lib/grammar2table')

test('grammar2table', function (t) {
  t.plan(1)

  var parseTable = grammar2table(simpleGrammar)

  // You can print this out with table2string if you want to visualize it..
  // console.log(require('../lib/table2string')(parseTable))

  t.deepEqual(parseTable, {"A,C,E,I,J":{"a":[["s","C,E,F,I,J"]],"b":[["s","I,J,K"]],"c":[["r",3]],"-1":[["r",3]],"T":[["g","B"]],"R":[["g","D"]]},"I,J,K":{"a":[],"b":[["s","I,J,K"]],"c":[["r",3]],"-1":[["r",3]],"T":[],"R":[["g","L"]]},"L":{"a":[],"b":[],"c":[["r",4]],"-1":[["r",4]],"T":[],"R":[]},"C,E,F,I,J":{"a":[["s","C,E,F,I,J"]],"b":[["s","I,J,K"]],"c":[["r",3]],"-1":[["r",3]],"T":[["g","G"]],"R":[["g","D"]]},"G":{"a":[],"b":[],"c":[["s","H"]],"-1":[],"T":[],"R":[]},"H":{"a":[],"b":[],"c":[["r",2]],"-1":[["r",2]],"T":[],"R":[]},"D":{"a":[],"b":[],"c":[["r",1]],"-1":[["r",1]],"T":[],"R":[]},"B":{"a":[],"b":[],"c":[],"-1":[["a"]],"T":[],"R":[]}})
})
