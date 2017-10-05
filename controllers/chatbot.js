var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var redis = require('redis')
const firebase = require('firebase')


// Redis function
var client = redis.createClient()
const setContext = (id, obj) => {
  client.set(id, JSON.stringify(obj), 'EX', 60)
}

// Firabase configuration
const config = {
  databaseURL: 'https://ada-firebase.firebaseio.com',
  projectId: 'ada-firebase'
}
firebase.initializeApp(config)
var Firebase = firebase.database()


// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: 'db8dcf97-e487-43cd-b512-f8e9bb5cfbf7', // replace with username from service key
  password: 'JZNk1HoKOlWn', // replace with password from service key
  path: { workspace_id: 'fdac2f60-aea3-442b-8bf0-029ca07e2b6f' }, // replace with workspace ID
  version_date: '2016-07-11'
});


exports.question = (req, res) => {
  console.log(req.body)
  var contextRedis = {}
  var message = {
    input: { text: req.body.message },
  }
  var dbFirebase = Firebase.ref('jofi/' + req.params.id)

  var setMessage = {
    from: req.params.id,
    message: {
      text: req.body.message
    },
    date: `${new Date()}`
  }

  dbFirebase.push(setMessage)

  client.get(req.params.id, function(err, replay) {
    if (err) {
      res.send(err)
    }
    if (replay) {
      contextRedis = JSON.parse(replay)
      message = {...message, context: contextRedis}
      sendResponse(message, req, res, dbFirebase)
    } else {
      sendResponse(message, req, res, dbFirebase)
    }
  })
}


var sendResponse = (message, req, res, dbFirebase) => {
  let setMessage = {
    from: 'jofi',
    message: {
      text: {}
    },
    date: `${new Date()}`
  }

  conversation.message(message, processResponse);

  function processResponse(err, response) {
    if (err) {
      console.error(err); // something went wrong
      return;
    }

    if (response.output.action != null) {

      // send response to user 
      dbFirebase.push({...setMessage, message: response.output})

      if(response.output.action.type = "get_job") {
        getJobFromAPI(response.output.action, function (listJob) {          
          console.log(listJob)

          // save context to redis
          setContext(req.params.id, { ...response.context })
          
          // setup new response 
          let responseWithListJob = {
            ...response.output,
            job: listJob,
            text: ['Berikut daftar pekerjaan yang kamu inginkan']
          }

          // send response from watson to firebase
          setMessage.message = responseWithListJob
          dbFirebase.push(setMessage)

          dbFirebase.push({...setMessage, message: {
            text: ['Kamu bisa cari kerja lagi atau mengakhir dialog ini']
          }})
          res.send(responseWithListJob)
        })
      }

    } else if (response.output.text.length != 0) {
      console.log('masuk ke set', response.output.text[0]);
      setContext(req.params.id, { ...response.context })

      // send response from watson to firebase
      setMessage.message = response.output
      dbFirebase.push(setMessage)

      res.send(response.output)
    }
  }
}

var getJobFromAPI = (action, cb) => {

  var sepecification = {
    location: action.location || '',
    expert: action.expert || '',
    list: "pekerjaan di " + action
  }

  return cb(sepecification)
}


