const chai = require('chai');
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
var assert = chai.assert;
// const server = 'http://localhost:3000'

// chai.use(chaiHttp)

// add helper to get city name
var getCityName = require('../helper/getCityName')
var checkEmail = require('../helper/checkEmail')
var getJob = require('../helper/getJob')
var sendEmail = require('../helper/sendEmail')

var fakeJobList = [{
  guid: 156191,
  link: 'https://stackoverflow.com/jobs/156191/it-solution-development-jenius?a=QnEW3LqsiBy',
  'a10:author': { 'a10:name': 'Jenius' },
  category: ['java', 'spring', 'json', 'xml'],
  title: 'IT Solution Development at Jenius (South Jakarta, Indonesia)',
  description: '&lt;p&gt;As a Solution Development you will be responsible to:&lt;/p&gt;&lt;br /&gt;&lt;ul&gt;&lt;br /&gt;&lt;li&gt;Understand client requirements and how they translate in application features&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Collaborate with a team of IT professionals to set specifications for new applications&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Design creative prototypes according to specifications&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Write high quality source code to program complete applications within deadlines&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Perform unit and integration testing before launch&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Conduct functional and non-functional testing&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Troubleshoot and debug applications&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Evaluate existing applications to reprogram, update and add new features&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Develop technical documents and handbooks to accurately represent application design and code&lt;/li&gt;&lt;br /&gt;&lt;/ul&gt;&lt;br /&gt;&lt;p&gt;&lt;strong&gt;Are You The Right Candidate?&lt;/strong&gt;&lt;/p&gt;&lt;br /&gt;&lt;ul&gt;&lt;br /&gt;&lt;li&gt;Bachelor Degree in IT, Computer Science or relevant field&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Having minimum 3 years of experience in relevant field&lt;/li&gt;&lt;br /&gt;&lt;li&gt;The ability to develop solution with minimum defect density within given timeline&lt;/li&gt;&lt;br /&gt;&lt;li&gt;The ability to self-assess risk of developed solution and provide mitigation action for continuous improvements&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Fluency in creating technical architecture documentation&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Technical qualification:&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Java&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Java Framework&lt;br /&gt;&lt;ul&gt;&lt;br /&gt;&lt;li&gt;Spring (AOP, Spring DM)&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Hibernate&lt;/li&gt;&lt;br /&gt;&lt;li&gt;OSGI&lt;/li&gt;&lt;br /&gt;&lt;/ul&gt;&lt;br /&gt;&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Oracle (DDL, DML)&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Web Service Protokol (SOAP)&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Rest / Json&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Apache Wicket (optional)&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Experience in building REST API (JSON &amp;amp; XML) based applications&lt;/li&gt;&lt;br /&gt;&lt;li&gt;Experiences with code refactoring, design patterns, design-driven development, continuous deployment, highly scalable applications, application security&lt;/li&gt;&lt;br /&gt;&lt;/ul&gt;',
  pubDate: 'Fri, 29 Sep 2017 08:40:11 Z',
  'a10:updated': '2017-09-29T08:40:11Z',
  location: 'South Jakarta, Indonesia'
}]




// describe("sendEmail function test", function() {
//   it("input empty paramater will return error", function(done) {
//     return sendEmail('','', function(response) {
//       // console.log(response)
//       assert.equal('', `${response.error}`)
//       done()
//     })
//   })
//   it("input email, and job list will return success", function() {
//     return sendEmail('cumiasem91@gmail.com', fakeJobList, function (response) {
//       // console.log(response)
//       assert.equal('', response)
//       // done()
//     })
//   })
// })

describe("GetCityName function test", function(){
  it("input longitude and latitude will get city Name Function testing", function (done) {
    return getCityName(`-6.260898`, `106.7814405`, function(city){
      assert.equal('Daerah Khusus Ibukota Jakarta', city)
      done()
    })
    // done()
  })
  it("will return error error status 400 if throw empty longitude and latitude", function (done) {
    return getCityName(``, ``, function (city) {
      assert.equal('400', `${city.status}`)
      done()
    })
  })
  it("input longitude only  will return error error status 400", function (done) {
    return getCityName(``, `106.7814405`, function (city) {
      assert.equal('400', `${city.status}`)
      done()
    })
  })
  it("input latitude only  will return error error status 400", function (done) {
    return getCityName(`-6.260898`, ``, function (city) {
      assert.equal('400', `${city.status}`)
      done()
    })
  })
})

describe("checkEmail helper test", function() {
  it("input empty will return false", function(done) {
    var emailCheck = checkEmail('')
    // console.log(emailCheck)
    expect(emailCheck).to.deep.equal(false)
    done()
  })
  it("Input random string return false", function(done) {
    var emailCheck = checkEmail('a')
    expect(emailCheck).to.deep.equal(false)
    done()
  })
  it("Input right email format will return true", function(done) {
    var emailCheck = checkEmail('cumiasem91@gmail.com')
    expect(emailCheck).to.deep.equal(true)
    done()
  })
})

describe("getJob function test", function() {
  it("input empty object will return empty", function(done) {
    let action = {

    }
    return getJob(action, function(jobList) {
      assert.equal(`${action}`, `${jobList}`)
      done()
    })
  })
  it("Input location only will return jobs list", function(done) {
    let action = {
      location: 'jakarta',
      expert: ''
    }
    return getJob(action, function(jobList) {
      jobList.should.be.an('array')
      done()
    })
  })
  it("Input expert only will return jobs list", function (done) {
    let action = {
      location: '',
      expert: 'IT'
    }
    return getJob(action, function (jobList) {
      jobList.should.be.an('array')
      done()
    })
  })
  it("Input expert and location only will return jobs list", function (done) {
    let action = {
      location: 'Jakarta',
      expert: 'IT'
    }
    return getJob(action, function (jobList) {
      jobList.should.be.an('array')
      done()
    })
  })
  it("Input anonymous city and expert will return jobs list", function (done) {
    let action = {
      location: 'bandung',
      expert: 'akuntansi'
    }
    return getJob(action, function (jobList) {
      assert.equal(undefined, jobList)
      done()
    })
  })
})