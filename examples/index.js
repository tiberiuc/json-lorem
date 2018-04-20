const {generateFromFile} = require('../')

const functions = {
  myCustomFunction: () =>  function(){
    return true
  },
}

const generatedObj = generateFromFile('template.js', {functions});

console.log( JSON.stringify(generatedObj, null, 2 ));
