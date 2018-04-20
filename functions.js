
const _ = require('lodash')
const moment = require('moment')
const faker = require('faker')
const Chance = require('chance')

const objectID = () => () => {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16)
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
    return (Math.random() * 16 | 0).toString(16)
  }).toLowerCase()
};

const index = () => function() { return this.index() }

const lorem = (type = 'sentence', length=1) => () => {
  return faker.lorem[type](length)
}

const number = (min, max) => () => {
  if(!min && !max) {
    return faker.random.number()
  }
  if(!max) {
    max = min
    min = 0
  }

  return faker.random.number({min, max})
}

const pastDate = format => () => {
  const date = moment(faker.date.past())

  if(format) {
    return date.format(format)
  }

  return date.toString()
}

const futureDate = format => () => {
  const date = moment(faker.date.future())

  if(format) {
    return date.format(format)
  }

  return date.toString()
}

const wrap = func => {
  return () => () => {
    return func.apply()
  }
}

module.exports = {
  index,
  objectID,
  lorem,
  email:wrap(faker.internet.email),
  firstName:  wrap(faker.name.firstName),
  lastName: wrap(faker.name.lastName),
  name:  wrap(faker.name.findName),
  phone: wrap(faker.phone.phoneNumber),
  company: wrap(faker.company.companyName),
  uuid: wrap(faker.random.uuid),
  bool: wrap(faker.random.boolean),
  city: wrap(faker.address.city),
  country: wrap(faker.address.country),
  pastDate,
  futureDate,
  number,
  random: arr =>  _.sample(arr),
  state: wrap(faker.address.state),
  street: wrap(faker.address.streetName),
  _,
  moment,
  faker,
  chance : new Chance(),
}

