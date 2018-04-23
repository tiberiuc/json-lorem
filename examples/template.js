{
  persons: [{
    'repeat(3)' : {
      _id: objectID(),
      index: index(),
      uuid: uuid(),
      isActive: bool(),
      picture: () => faker.image.avatar(),
      phone: phone(),
      name: name(),
      welcome: () => {
        return 'Welcome ${this.name}!'
      },
      alert: `You have ${number(10)()} unread messsages!`,
      eyeColor: random(['brown', 'blue', 'green']),
      lastLogin: pastDate(),
    }
  }],
  messages: [{
    'repeat(2)': {
      msg:{
        from: function () {
          return random(this.getRoot().persons)._id
        },
        to: function () {
          return random(this.getRoot().persons)._id
        },
        message: lorem('paragraph'),
        important: myCustomFunction(),
      },
    }
  }],

}
