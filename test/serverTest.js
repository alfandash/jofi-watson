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
  it('Chat something will return a message', function (done) {
    chai.request(server)
      .post('/chatbot/testReq')
      .send({ 'message': 'halo' })
      .end(function (err, res) {
        res.body.should.be.a('object')
        res.should.has.status(200)
        done()
      })
  })
  it('Chat find job directly in some location will return object joblist', function (done) {
    chai.request(server)
      .post('/chatbot/testReq')
      .send({ 'message': 'di jakarta' })
      .end(function (err, res) {
        res.body.should.be.a('object')
        res.body.should.have.property('job')
        res.should.has.status(200)
        done()
      })
  })
  it('Chat find job directly in one expertis will return object joblist', function (done) {
    chai.request(server)
      .post('/chatbot/testReq')
      .send({ 'message': 'bidang IT' })
      .end(function (err, res) {
        res.body.should.be.a('object')
        res.body.should.have.property('job')
        res.should.has.status(200)
        done()
      })
  })
  it('Chat find a job will return message from ai', function (done) {
    chai.request(server)
      .post('/chatbot/testReq')
      .send({ 'message': 'cari kerjaan dong' })
      .end(function (err, res) {
        res.body.should.be.a('object')
        res.should.has.status(200)
        done()
      })
  })
  it('Chat find job in some location will return object joblist', function (done) {
    chai.request(server)
      .post('/chatbot/testReq')
      .send({ 'message': 'di jakarta' })
      .end(function (err, res) {
        res.body.should.be.a('object')
        res.body.should.have.property('job')
        res.should.has.status(200)
        done()
      })
  })
  it('Chat want to find other job will return message from ai', function (done) {
    chai.request(server)
      .post('/chatbot/testReq')
      .send({ 'message': 'cari kerjaan dong yang lain' })
      .end(function (err, res) {
        res.body.should.be.a('object')
        res.should.has.status(200)
        done()
      })
  })
  it('Chat find job in one expertis will return object joblist', function (done) {
    chai.request(server)
      .post('/chatbot/testReq')
      .send({ 'message': 'bidang IT' })
      .end(function (err, res) {
        res.body.should.be.a('object')
        res.body.should.have.property('job')
        res.should.has.status(200)
        done()
      })
  })
  it('Chat find history last search will return object with joblist', function (done) {
    chai.request(server)
      .post('/chatbot/testReq')
      .send({ 'message': 'cari pencarian sebelumnya' })
      .end(function (err, res) {
        res.body.should.be.a('object')
        res.should.has.status(200)
        done()
      })
  })
  it('Chat want to send last searching will ask to send email', function (done) {
    chai.request(server)
      .post('/chatbot/testReq')
      .send({ 'message': 'email hasil pencarian sebelumnya' })
      .end(function (err, res) {
        res.body.should.be.a('object')
        res.should.has.status(200)
        done()
      })
  })
  it('chat send email will send email last history', function (done) {
    chai.request(server)
      .post('/chatbot/testReq')
      .send({ 'message': 'alfand91@gmail.com' })
      .end(function (err, res) {
        res.body.should.be.a('object')
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