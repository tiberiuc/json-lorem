 # json-lorem
Easy to use ( Javascript based templating ), very extensible ( add your own function ), fully loaded(faker, chancejs, lodash and momentjs are already added) custom JSON generator with fake data


## Features
- JS based templating system ( you can use JS functions or ES6 literal templates )
- Easy to add your own functions or libraries to be use inside templates
- Already packed with good stuff: faker, chancejs, lodash and momentjs ( more to come  )

## Install
```
$ npm install --save json-lorem
```

## Use

```javascript

   import {generate} from 'json-lorem';

  const template = `{
    person: {
      name: '${firstName()} ${lastName()}',
      phone: phone(),
      company: company(),
      avatar: faker.image.avatar()
    },
    messages: [
    {
      'repeact(5)': {
        _id: objectID(),
        idx: index(),
        sender: function(){
          return this.getRoot().person.name
        },
        msg: lorem('paragraphs', 2)
      }
    }
    ]
  }`

```

## API
- generate(string, {optios})
- generateFromFile( filename, {options} )

options :
```
{
  functions: {
    /* injected functions, libraries or vars
     * ex:
     * myFunc: () => { return 'myValue' },
     * myVar: 'myValue'
     */
  }
  }
```

## Functions
- repeat( [min], max )
- index()
- objectID()
- lorem([type], [count=1]) // type are supported types from faker: word, words, paragraph, paragraphs, stentence, senteces, etc
- email()
- firstName()
- lastName()
- name()
- phone()
- company()
- uuid()
- bool()
- city()
- country()
- pastDate()
- futureDate()
- number([min], [max])
- radom(array)
- state()
- street()
- _
- moment
- chance
- faker


## Example
You can see a complete example [here](example)

## Tests
AVA is used as test runner. To run the tests, run

```
npm test
```

## Contributors
- [Tiberiu Craciun](https://github.com/tiberiuc)
