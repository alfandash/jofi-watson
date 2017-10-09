const chai = require('chai');
const chaiHttp = require('chai-http')
const should = chai.should()
const server = 'http://localhost:3000'

chai.use(chaiHttp)

describe("Sever load successful", function() {
  it('express load', function(done) {
    chai.request(server)
    .get('/')
    .end(function(err, res){
      res.should.has.status(200)
      done()
    })
  })
  it('chatbot api fully loaded', function(done) {
    chai.request(server)
    .post('/chatbot/testReq')
    .send({ 'message': ''})
    .end(function(err, res){
      res.should.has.status(200)
      done()
    })
  })
})

// describe("API test for chatbot", function () {
//   it("", function (done) {
//     chai.request(server)

//   })
// })