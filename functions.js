
const _ = require('lodash')
const moment = require('moment')
const faker = require('faker')
const Chance = require('chance')

const objectID = () => {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16)
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
    return (Math.random() * 16 | 0).toString(16)
  }).toLowerCase()
};

const index = () => function() { return this.index() }

const lorem = (type = 'sentence', length=1) => {
  return faker.lorem[type](length)
}

const number = (min, max) => {
  if(!min && !max) {
    return faker.random.number()
  }
  if(!max) {
    max = min
    min = 0
  }

  return faker.random.number({min, max})
}

const pastDate = format => {
  const date = moment(faker.date.past())

  if(format) {
    return date.format(format)
  }

  return date.toString()
}

const futureDate = format => {
  const date = moment(faker.date.future())

  if(format) {
    return date.format(format)
  }

  return date.toString()
}

module.exports = {
  index,
  objectID,
  lorem,
  email: faker.internet.email,
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  name: faker.name.findName,
  phone: faker.phone.phoneNumber,
  company: faker.company.companyName,
  uuid: faker.random.uuid,
  bool: faker.random.boolean,
  city: faker.address.city,
  country: faker.address.country,
  pastDate,
  futureDate,
  number,
  random: _.sample,
  state: faker.address.state,
  street: faker.address.streetName,
  _,
  moment,
  faker,
  chance : new Chance(),
}

