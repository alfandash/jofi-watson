const axios = require('axios')
var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=-6.260898,106.7814405&sensor=true'


var redis = require('redis')

var client = redis.createClient()

// Redis function to set redis
const setCity = (latitude = '', longitude = '', city = '') => {
  console.log('latitude ------------', latitude)
  client.set('setCity' + latitude + longitude, city, 'EX', 1200)
} 

function getCityName (latitude, longitude, cb) {
  var googleMapApi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true&key=AIzaSyCsPckOoh98M3FLpimxQn5Hx4a_qB12uQs`

  // client.get('setCity' + latitude + longitude, function (err, replay) {
  //   if (err) {
  //     cb(err)
  //   } else if (replay) {
  //     console.log('redis api city google ------------', replay)
  //     // return an redis
  //     if (replay) {
  //       console.log('masuk-------')
  //       cb(replay)
  //     } else {
  //       cb('')
  //     }
  //   } else {
  //     console.log('masuk sini--------------')
  //     axios.get(googleMapApi)
  //     .then(({ data }) => {
  //       console.log('---------', data.results[0].address_components[7])
  //       // set redis
  //       if (data.results[0].address_components[7] !== undefined) {
  //         setCity(latitude, longitude, data.results[0].address_components[7].short_name)
  //       } else {
  //         setCity(latitude, longitude, '')
  //       }

  //       cb(data.results[0].address_components[7].short_name)
  //     })
  //     .catch(error => {
  //       // error 
  //       cb(error.response)
  //     })
      
  //   }
  // })

  // return {}


  var city = axios.get(googleMapApi)
  .then(({ data }) => {
    cb(data.results[0].address_components[7].short_name)
  })
  .catch(error => {
    // error 
    cb(error.response)
  })
  return {}
}

module.exports = getCityName