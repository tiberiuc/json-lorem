import test from 'ava'
import loremjson from './index.js'

console.clear()

test('simple parse', t => {
  const data =`{
    a: 1,
    b: 2
  }
  `
  const result = loremjson.generate(data)
  t.deepEqual(result, {a:1, b:2});
});


test('nested parse', t => {
  const data =`{
    a: 1,
    b: 2,
    arr: [
      'test 1',
      'test 2',
      {
        name: 'name'
      }
    ]
  }
  `
  const result = loremjson.generate(data)
  t.deepEqual(result, {a:1, b:2, arr: ['test 1', 'test 2', {name: 'name'}]});
});

test('repeat', t => {
  const data =`{
    arr:[
      {
        'repeat(2)': {
          a: 1
        }
      }
    ]
}`
  const result = loremjson.generate(data)
  t.deepEqual(result, {arr:[{a:1}, {a:1}]})
})

test('index', t => {
  const data=`{
    arr:[
      {
        'repeat(2)': {
          i: index()
        }
      }
    ]

}`
  const result = loremjson.generate(data)
  t.deepEqual(result, {arr:[{i:0}, {i:1}]})
})

test('repeat min max', t => {
  const data =`{
    arr:[
      {
        'repeat(3,3)': {
          a: index()
        }
      }
    ]
}`
  const result = loremjson.generate(data)
  t.deepEqual(result, {arr:[{a:0}, {a:1}, {a:2}]})
})

test('inline function', t => {
  const data =`{
    fun: function() {
      return 'f'
    }
}`

  const result = loremjson.generate(data)
  t.deepEqual(result, {fun:'f'})
})

test('custom function', t => {
  const data =`{
    fun: myFunction()
    }`

  const functions = {
    myFunction: function() {
      return 'myResult'
    }
  }
  const result = loremjson.generate(data, {functions})
  t.deepEqual(result, {fun:'myResult'})

})

test('template literals es6', t => {
  const data =`{
    tpl: \`\$\{myValue}\`
  }`

  const functions = {
    myValue: 3
  }
  const result = loremjson.generate(data, {functions})
  t.deepEqual(result, {tpl:'3'})
})

test('template literals simple string', t => {
  const data =`{
    tpl: '\$\{myValue}\'
  }`

  const functions = {
    myValue: 3
  }
  const result = loremjson.generate(data, {functions})
  t.deepEqual(result, {tpl:'3'})
})

test('index inside template literals', t => {
  const data =`{
    tpl: [
      '\$\{index()}'
    ]
  }`

  const result = loremjson.generate(data)
  t.deepEqual(result, {tpl:['0']})
})


