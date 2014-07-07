# Beefalo

A streaming shift-reduce parser written in vanilla Javascript

[![Build Status](https://travis-ci.org/ben-ng/beefalo.svg?branch=master)](https://travis-ci.org/ben-ng/beefalo)

[![browser support](https://ci.testling.com/ben-ng/beefalo.png)
](https://ci.testling.com/ben-ng/beefalo)

## Usage

```javascript
var beefalo = require('beefalo')
  , Fragment = require('Fragment')
  , grass = require('grass')
  , fs = require('fs')
  , tokens
  , grammar

// A token is any character 'a', 'b', or 'c'
tokens = new Fragment('a', 'a').union(new Fragment('b', 'b'))
                               .union(new Fragment('c', 'c'))

grammar = {
  nonTerminals: ['S', 'A']
, terminals: ['a', 'b', 'c']
, rules: [
    ['S', ['A']]
  , ['A', ['a', 'A']]
  , ['A', ['b', 'A']]
  , ['A', ['A', 'C']]
  ]
}

fs.createReadStream('input.txt')
  .pipe(grass(tokens))
  .pipe(beefalo(grammar))

```
