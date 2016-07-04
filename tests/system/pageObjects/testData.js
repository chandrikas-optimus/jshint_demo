var date = new Date();

var testData = {
    firstName: 'Mobify',
    lastName: 'Nightwatch',
    address1: '1574 Gulf Road',
    city: 'Point Roberts',
    state: 'WA',
    zip: '98281',
    country: 'United States',
    email: 'mobifynightwatch@gmail.com',
    signInEmail: 'mobifyqanightwatch@gmail.com',
    signInPassword: 'p4ssword',
    telNumber: '6045551234',
    creditCardNumber: '4111111111111111',
    creditCardExpiryMonth: '01',
    creditCardExpiryYear: date.getFullYear() + 5,
    creditCardCcv: '123'
};

module.exports = testData;
