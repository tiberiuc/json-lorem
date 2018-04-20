const fs = require('fs')
const _ = require('lodash')
const functions = require('./functions')


const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}


const runData = (data, context, opts) => {

  let root = null

  const runValue = (val, current,  parent, currentIndex) => {

    root = root || parent
    const currentData = !Array.isArray(current) ? current : {}
    const newContext = Object.assign({}, currentData, context, {
      getRoot : () => root,
      index: () => currentIndex,
      getParent: () => parent,
    } )

    let result
    if(typeof val === 'function') {
      result = runInContext(val, newContext)
      return result
    }

    if(typeof val === 'string') {
      result = evalInContext('`'+val+'`', newContext)
      return result
    }

    if(Array.isArray(val)) {
      result = runArray(val, current)
      return result
    }

    if(typeof val === 'object') {
      result = runObject(val, current, currentIndex)
      return result
    }

    return val
  }

  const runRepeat = (min, max, obj, parent, currentIndex) => {
    const repeat = max ? getRandomInt(min, max+1) : min

    const templateObj = _.cloneDeep(obj)

    for(let i=0; i<repeat; i++){
      const result = runObject(templateObj, parent, i)
      if(Array.isArray(parent)){
        parent.push(_.cloneDeep(result))
      } else {
        parent[i] = result
      }
    }

    return undefined;

  }

  const runObject = (obj, parent, currentIndex) =>  {
    const keys = _.keys(obj)

    const reg = /[ \t]*repeat[ \t]*\([ \t]*([0-9]+)([ \t]*[,][ \t]*([0-9]+)){0,1}[ \t]*\)[ \t]*/
    if(keys.length === 1 && keys[0].match(reg)) {
      let [x, min, next, max] = keys[0].match(reg)
      min = parseInt(min)
      max = parseInt(max)

      return runRepeat(min, max, _.values(obj)[0], parent, currentIndex)
    }

    const result = {}
    for(let key in obj){
      const val = obj[key]
      result[key] = runValue(val, result, parent, currentIndex)
    }
    return result

  }
  const runArray = (arr, parent) =>  {
    const result = []
    let currentIndex = 0
    arr.forEach( val => {
      const res = runValue(val, result, parent, currentIndex)
      if(res !== undefined) {

        result.push(res)
      }
      currentIndex++
    })

    return result
  }

  root = runValue(data, null)
  return root
}

const runInContext = (func, context) => {
  try {
    return func.apply(context, _.values(context))
  } catch (e) {
    console.log('JSON ERROR:',e.message)
    return null
  }

}

const evalInContext = (source, context) => {
  source = `(function(${Object.keys(context).join(', ') })
      { return ${source}; }
    )`

  try {
    const compiled = eval(source)
    return runInContext(compiled, context)
  } catch (e) {
    console.log('JSON ERROR:',e.message)
    return null
  }

}

const generate = (data, opts) => {
  const custom = (opts) ? opts.functions : {}

  const context = Object.assign({}, functions, custom)

  let result

  result = evalInContext(data, context)

  return runData(result, context, opts)
}

const generateFromFile = (filename, opts) => {
  const data = fs.readFileSync(filename)

  return generate(data, opts)
}

module.exports = {
  generate,
  generateFromFile,
}
