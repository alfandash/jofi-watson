const chai = require('chai');
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
var assert = chai.assert;
// const server = 'http://localhost:3000'

// chai.use(chaiHttp)

// add helper to get city name
var getCityName = require('../helper/getCityName')

describe("Helper test", function(){
  it("Get city Name Function testing", function (done) {

    getCityName(`-6.260898`, `106.7814405`, function(city){
      // return city
      console.log(city)
      // console.log(v)
      // expect(city).to.equal('daerah khusus ibukota jakarta');
      assert.equal('Daerah Khusus Ibukota Jakarta', city)
      // done()
    })
    // done()
  })
})