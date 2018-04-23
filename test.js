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

test('repeat() create different objects', t => {
  const  data=`{
    arr:[{
      'repeat(3)':{
        _id: objectID(),
        lorem: lorem("paragraph"),
      }
    }]
  }`

  const {arr} = loremjson.generate(data)
  t.false( arr[0].lorem === arr[1].lorem && arr[1].lorem === arr[2].lorem)
})

test('this', t => {
  const  data=`{
    c: 1,
    f: function(){
      return this.c;
    }
}`

  const result = loremjson.generate(data)
  t.deepEqual(result, {c: 1, f:1})

})

test('this in repeat()', t => {
  const  data=`{
    arr:[{
      'repeat(1)':{
        c: 2,
        f: function(){
          return this.c;
        }
      }
    }]
  }`

  const result = loremjson.generate(data)
  t.deepEqual(result, {arr:[{c: 2, f:2}]})

})


test('this in template literals', t => {
  const  data=`{
    c: 1,
    f: function(){
      return \`count \$\{this.c}\`;
    }
}`

  const result = loremjson.generate(data)
  t.deepEqual(result, {c: 1, f:'count 1'})

})



test('string templates with this in repeat()', t => {
  const  data=`{
    arr:[{
      'repeat(1)':{
        c: 2,
        f: function(){
          return \`count \$\{this.c}\`;
        }
      }
    }]
  }`

  const result = loremjson.generate(data)
  t.deepEqual(result, {arr:[{c: 2, f:'count 2'}]})

})

test('this reference function', t => {
  const  data=`{
    n: name(),
    f: function(){
      return this.n;
    }
}`

  const result = loremjson.generate(data)
  const identical = result.n === result.f
  t.is(identical, true)

})

test('this reference function with same name', t => {
  const  data=`{
    name: name(),
    f: function(){
      return this.name;
    }
}`

  const result = loremjson.generate(data)
  t.true(result.name === result.f)

})

test('this reference function with same name inside string literals', t => {
  const  data=`{
    name: name(),
    f: function(){
      return \`Welcome \$\{this.name\}!\`;
    }
}`

  const result = loremjson.generate(data)
  t.true(result.f === `Welcome ${result.name}!`)

})


test('repeat with this reference function with same name inside string literals', t => {
  const  data=`{
  arr: [{
    'repeat(1)': {
        name: name(),
        f: function(){
          return \`Welcome \$\{this.name\}!\`;
        }
    }
  }]
}`

  const result = loremjson.generate(data)
  t.true(result.arr[0].f === `Welcome ${result.arr[0].name}!`)

})

