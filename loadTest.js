'use strict';

module.exports = {
  generateRandomData
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomData(userContext, events, done) {
  // generate data with Faker:
  const name = ` ${Faker.name.lastName()}`;
  // add variables to virtual user's context:
  userContext.vars.name = name;
  userContext.vars.id = Faker.random.number({min:1000, max:5000});;
  userContext.vars.answer = Faker.random.number({min:5, max:100});
  // continue with executing the scenario:
  return done();
}
