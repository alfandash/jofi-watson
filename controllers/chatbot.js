var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var redis = require('redis')
const firebase = require('firebase')

// add helper to get city name
var getCityName = require('../helper/getCityName')

// add mode
var sendResponse = require('./sendResponse')

// Redis function
var client = redis.createClient()

// Firabase configuration
const config = {
  databaseURL: 'https://ada-firebase.firebaseio.com',
  projectId: 'ada-firebase'
}
firebase.initializeApp(config)
var Firebase = firebase.database()


exports.question = (req, res) => {
  console.log(req.body)
  var message = {
    input: { text: req.body.message.trim() }
  }
  var dbFirebase = Firebase.ref('jofi/' + req.params.id)

  var setMessage = {
    from: req.params.id,
    message: {
      text: req.body.message
    },
    date: `${new Date()}`
  }

  var contextRedis = {}

  // push message from user to firebase
  dbFirebase.push(setMessage)

  client.get(req.params.id, function(err, replay) {

    if (err) {
      res.send(err)
    }
    if (replay) {
      contextRedis = JSON.parse(replay)
      message = {...message, context: {
        ...contextRedis, 
        job: req.body.choosenJob || '',
        action: req.body.action || '',
        location: req.body.location || ''
      }}

      switch (req.body.action) {
        case "get_job_by_location": {
          getCityName(req.body.location.latitude, req.body.location.longitude, function(city) {
            message = {...message, input: { text: `${city}`}} 
            sendResponse(message, req, res, dbFirebase)
          })
        }
        break;
      
        default: {
          sendResponse(message, req, res, dbFirebase)
        }
          break;
      }
    } else {
      message = { ...message, context: {
       ...req.body
      }}

      console.log(`masuk sini`,req.body.action)
      switch (req.body.action) {
        case "get_job_by_location": {
          getCityName(req.body.location.latitude, req.body.location.longitude, function(city) {
            message = {...message, input: { text: `${city}`}} 
            sendResponse(message, req, res, dbFirebase)
          })
        }
        break;
      
        default: {
          sendResponse(message, req, res, dbFirebase)
        }
          break;
      }
    }
  })
}
