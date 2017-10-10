const axios = require('axios')
var fastXmlParser = require('fast-xml-parser');
var redis = require('redis')

var papuas = require('../models/papua')
var babels = require('../models/babel')
var kepris = require('../models/kepri')

var client = redis.createClient()

// Redis function
const setJobLocationExpert = (location = '',expert = '', obj) => {
  client.set('getJob' + location + expert, JSON.stringify(obj), 'EX', 120)
}

var getJobList = (action, cb) => {

  // console.log(action)
  var specification = {
    location: action.location || '',
    expert: action.expert || ''
  }

  // console.log(specification)
  if (specification.location !== '' && specification.expert !== '') {
    const url = `https://stackoverflow.com/jobs/feed?q=${encodeURI(specification.expert)}&l=${encodeURI(specification.location)}&d=20&u=Km`
    client.get('getJob' + specification.location + specification.expert, function (err, replay) {
      if (err) {
        cb(err)
      } else if (replay) {

        // console.log('redis location dan expert------------', replay)
        // return an redis
        if (replay !== 'undefined') {
          // console.log('masuk-------')
          cb(JSON.parse(replay))
        } else {
          cb(undefined)
        }

      } else {
        axios.get(url)
        .then(result => {
          var jsonString = fastXmlParser.parse(result.data);
          // console.log(jsonString.rss.channel.item)\

          // set redis
          setJobLocationExpert(specification.location, specification.expert, jsonString.rss.channel.item)

          cb(jsonString.rss.channel.item)
        })
        .catch(err => {
          console.log(err)
          cb(err)
        })
      }
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

      client.get('getJob' + specification.location, function (err, replay) {
        if (err) {
          cb(err)
        } else if (replay) {

          // console.log('redis location------------', replay)
          // return an redis
          if (replay !== 'undefined') {
            // console.log('masuk-------')
            cb(JSON.parse(replay))
          } else {
            cb(undefined)
          }

        } else {
          axios.get(locationUrl)
          .then(result => {
            var jsonString = fastXmlParser.parse(result.data);

            // set redis
            setJobLocationExpert(specification.location, '', jsonString.rss.channel.item)

            cb(jsonString.rss.channel.item)
          })
          .catch(err => {
            console.log(err)
            cb(err)
          })
        }
      })
      // axios.get(locationUrl)
      //   .then(result => {
      //     var jsonString = fastXmlParser.parse(result.data);
      //     cb(jsonString.rss.channel.item)
      //   })
      //   .catch(err => {
      //     cb(err)
      //     // console.log(err)
      //   })
    }
  } else if (specification.expert !== '') {
    const urlExpert = `https://stackoverflow.com/jobs/feed?q=${encodeURI(specification.expert)}&l=indonesia&d=20&u=Km`

    client.get('getJob' + specification.expert, function (err, replay) {
      if (err) {
        cb(err)
      } else if (replay) {

        // console.log('redis exoert------------', replay)
        // return an redis
        if (replay !== 'undefined') {
          // console.log('masuk-------')
          cb(JSON.parse(replay))
        } else {
          cb(undefined)
        }

      } else {
        axios.get(urlExpert)
          .then(result => {
            var jsonString = fastXmlParser.parse(result.data);

            // set redis
            setJobLocationExpert('', specification.expert, jsonString.rss.channel.item)

            cb(jsonString.rss.channel.item)
          })
          .catch(err => {
            console.log(err)
            cb(err)
          })
      }
    })

    // axios.get(urlExpert)
    //   .then(result => {
    //     var jsonString = fastXmlParser.parse(result.data);
    //     console.log('replay get ob --------------', jsonString.rss.channel.item)
    //     cb(jsonString.rss.channel.item)
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  } else {
    return cb({})
  }
}

module.exports = getJobList