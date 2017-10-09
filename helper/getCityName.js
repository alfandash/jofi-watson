const axios = require('axios')
var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=-6.260898,106.7814405&sensor=true'


function getCityName (latitude, longitude, cb) {
  var googleMapApi = `http://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true`
  
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

// getCityName(`-6.260898`, `106.7814405`, function(data) {console.log(data)})