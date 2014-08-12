var test = require('tape')
  , str2int = require('../lib/string-to-int')

test('string to int', function (t) {
  t.plan(4)

  t.equal(str2int(String.fromCharCode(128)), 128, 'Should be max(ascii char codes)')
  t.equal(str2int(String.fromCharCode(1, 128)) - str2int(String.fromCharCode(128))
        , 128, 'Difference should be 128')
  t.equal(str2int('bz'), 12666, 'bz should be 12666')
  t.equal(str2int('taco'), 244871663, 'taco should be 244871663')
})
