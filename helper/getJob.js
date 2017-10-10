const axios = require('axios')
var fastXmlParser = require('fast-xml-parser');


var papuas = require('../models/papua')
var babels = require('../models/babel')
var kepris = require('../models/kepri')


function findAllPapua() {
  papuas.find({}, function (err, result) {
    if (err) {
      res.status(500).send(err)
    } else {
      console.log(result)
    }
  })
}


var getJobList = (action, cb) => {

  console.log(action)
  var specification = {
    location: action.location || '',
    expert: action.expert || ''
  }

  // console.log(specification)
  if (specification.location !== '' && specification.expert !== '') {
    const url = `https://stackoverflow.com/jobs/feed?q=${encodeURI(specification.expert)}&l=${encodeURI(specification.location)}&d=20&u=Km`
    axios.get(url)
      .then(result => {
        var jsonString = fastXmlParser.parse(result.data);
        // console.log(jsonString.rss.channel.item)
        cb(jsonString.rss.channel.item)
      })
      .catch(err => {
        console.log(err)
      })
  } else if (specification.location !== '') {
    // console.log('lokasi nih bra',specification.location)
    if (specification.location == 'Kepulauan Bangka Belitung') {
      babels.find({}, function (err, result) {
        if (err) {
          cb(err)
        } else {
          let manipulateResultKey = result.map(function (obj) {
            obj.__v = undefined;

            newObj = JSON.stringify(obj)
            return JSON.parse(newObj);
          });
          cb(manipulateResultKey)
        }
      })
    } else if (specification.location == 'Riau') {
      kepris.find({}, function (err, result) {
        if (err) {
          cb(err)
        } else {
          let manipulateResultKey = result.map(function (obj) {
            obj.__v = undefined;

            newObj = JSON.stringify(obj)
            return JSON.parse(newObj);
          });
          // console.log('result from papua', manipulateResultKey)
          cb(manipulateResultKey)
        }
      })
    } else if (specification.location == 'Papua') {
      papuas.find({}, function (err, result) {
        if (err) {
          cb(err)
        } else {
          let manipulateResultKey = result.map(function (obj) {
            obj.__v = undefined;

            newObj = JSON.stringify(obj)
            return JSON.parse(newObj);
          });
          // console.log('result from papua', manipulateResultKey)
          cb(manipulateResultKey)
        }
      })
    } else {
      const locationUrl = `https://stackoverflow.com/jobs/feed?l=${encodeURI(specification.location)}%2c+Indonesia&d=20&u=Km`
      axios.get(locationUrl)
        .then(result => {
          var jsonString = fastXmlParser.parse(result.data);
          cb(jsonString.rss.channel.item)
        })
        .catch(err => {
          cb(err)
          // console.log(err)
        })
    }
  } else if (specification.expert !== '') {
    const url = `https://stackoverflow.com/jobs/feed?q=${encodeURI(specification.expert)}&l=indonesia&d=20&u=Km`
    axios.get(url)
      .then(result => {
        var jsonString = fastXmlParser.parse(result.data);
        cb(jsonString.rss.channel.item)
      })
      .catch(err => {
        console.log(err)
      })
  }


  const expertUrl = `https://stackoverflow.com/jobs/feed?q=${specification.expert}&l=indonesia&d=20&u=Km`

}

module.exports = getJobList