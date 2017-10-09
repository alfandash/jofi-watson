const axios = require('axios')
var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=-6.260898,106.7814405&sensor=true'


function getCityName (latitude, longitude, cb) {
  var googleMapApi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true&key=AIzaSyCsPckOoh98M3FLpimxQn5Hx4a_qB12uQs`
  
  var city = axios.get(googleMapApi)
  .then(({ data }) => {
    cb(data.results[0].address_components[7].short_name)
  })
  .catch(error => {
    cb(error)
  })
  return {}
}

module.exports = getCityName