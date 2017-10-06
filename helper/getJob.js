const axios = require('axios')
var fastXmlParser = require('fast-xml-parser');

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
        cb(jsonString.rss.channel.item)
      })
      .catch(err => {
        console.log(err)
      })
  } else if (specification.location !== '') {
    const locationUrl = `https://stackoverflow.com/jobs/feed?l=${encodeURI(specification.location)}%2c+Indonesia&d=20&u=Km`
    axios.get(locationUrl)
      .then(result => {
        var jsonString = fastXmlParser.parse(result.data);
        cb(jsonString.rss.channel.item)
      })
      .catch(err => {
        console.log(err)
      })
  } else if (specification.expert !== '') {
    console.log('masuk sini')
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