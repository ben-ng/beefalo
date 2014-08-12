/*
* This is so nonterminals can be expressed as unique integers instead of
* strings.
*/
function str2int (str) {
  var i = str.length - 1
    , position = 0
    , val = 0

  for(; i >= 0; --i) {
    // 65535 is the max of charCodeAt, but we treat 128 as our base
    // because we only care about ascii
    val = val + str.charCodeAt(i) * Math.pow(128, position)
    position++
  }

  return val
}

module.exports = str2int
