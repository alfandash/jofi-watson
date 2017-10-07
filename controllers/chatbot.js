var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var redis = require('redis')
const firebase = require('firebase')
const axios = require('axios')
var fastXmlParser = require('fast-xml-parser');

// include helpers
var getJobList = require('../helper/getJob')
var sendEmail = require('../helper/sendEmail')
var checkEmail = require('../helper/checkEmail')

// Redis function
var client = redis.createClient()
const setContext = (id, obj) => {
  client.set(id, JSON.stringify(obj), 'EX', 60)
}

const setLogSearchJob = (id, jobList) => {
  client.set(`${id}logSearchJob`, JSON.stringify(jobList))
}

const setLogJobChoosen = (id, job) => {
  client.set(`${id}logJobChoosen`, JSON.stringify(job))
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

  dbFirebase.push(setMessage)

  client.get(req.params.id, function(err, replay) {
    if (err) {
      res.send(err)
    }
    if (replay) {
      contextRedis = JSON.parse(replay)
      message = {...message, context: {
        ...contextRedis, 
        job: req.body.choosenJob || ''
      }}
      sendResponse(message, req, res, dbFirebase)
    } else {

      // example if using variable
      // message = { ...message, context: {name: 'alfan'} }
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

  // set job choosen if any
  console.log('message di console log',message)

  conversation.message(message, processResponse);

  function processResponse(err, response) {

    console.log('----response', req.params.id, response.output)
    if (err) {
      console.error(err); // something went wrong
      return;
    }

    if (response.output.action != null) {
      // send response to user 
      dbFirebase.push({...setMessage, message: response.output})

      if (response.output.action.type === "send_choosen_job_email") {

        // save context to redis
        setContext(req.params.id, { ...response.context })

        //check email before sent email
        if (checkEmail(response.input.text)) {
          client.get(`${req.params.id}logJobChoosen`, function (err, replay) {
            if (replay) {
              sendEmail(response.input.text, [JSON.parse(replay)], function (status) {
                console.log(status)
                var responseMessage = {
                  ...response.output,
                  text: [`Lowongan yang kamu pilih Jofi kirim ke email ${response.input.text}`]
                }

                // send response from watson to firebase
                setMessage.message = responseMessage
                dbFirebase.push(setMessage)

                // send response to client
                res.send(setMessage)
              })
            } else {
              var responseRejection = {
                ...response.output,
                text: [`Sepertinya kamu belum memilih lowongan yah`]
              }

              // send response from watson to firebase
              setMessage.message = responseRejection
              dbFirebase.push(setMessage)

              // send response to client
              res.send(setMessage)
            }
          })
        } else {
          var responseRejection = {
            ...response.output,
            text: [`Email yang kamu masukkan tidak sesuai nih ulangi dari awal yah`]
          }

          // send response from watson to firebase
          setMessage.message = responseRejection
          dbFirebase.push(setMessage)

          // send response to client
          res.send(setMessage)
        }
        

      } else if (response.output.action.type === "save_choosen_job") {
        // save context to redis
        setContext(req.params.id, { ...response.context })

        //save job choose to redis
        setLogJobChoosen(req.params.id, response.output.action.job)

        // send response to client
        res.send({...setMessage, message: response.output })

      } else if (response.output.action.type === "send_email") {
        // save context to redis
        setContext(req.params.id, { ...response.context })

        //check email before sent email
        if (checkEmail(response.input.text)) {
          client.get(`${req.params.id}logSearchJob`, function (err, replay) {
            if (replay) {
              sendEmail(response.input.text, JSON.parse(replay), function (status) {
                console.log(status)
                var responseMessage = {
                  ...response.output,
                  text: [`Hasil pencarian lowongan sudah Jofi kirim ke email ${response.input.text}`]
                }

                // send response from watson to firebase
                setMessage.message = responseMessage
                dbFirebase.push(setMessage)

                // send response to client
                res.send(setMessage)
              })
            } else {
              var responseRejection = {
                ...response.output,
                text: [`Sepertinya kamu belum pernah mencari pekerjaan, coba cari dulu pekerjaan yah`]
              }

              // send response from watson to firebase
              setMessage.message = responseRejection
              dbFirebase.push(setMessage)

              // send response to client
              res.send(setMessage)
            }
          })
        } else {
          var responseRejection = {
            ...response.output,
            text: [`Email yang kamu masukkan tidak sesuai nih ulangi dari awal yah`]
          }

          // send response from watson to firebase
          setMessage.message = responseRejection
          dbFirebase.push(setMessage)

          // send response to client
          res.send(setMessage)
        }

      } else if (response.output.action.type === "find_history") {
         client.get(`${req.params.id}logSearchJob`, function (err, replay) {

           // save context to redis
           setContext(req.params.id, { ...response.context })

           if (replay) {
            // setup new response 
            let responseWithHistoryJob = {
              ...response.output,
              job: JSON.parse(replay),
              text: ['Berikut daftar pekerjaan terakhir yang kamu cari']
            }

            // send response from watson to firebase
            setMessage.message = responseWithHistoryJob
            dbFirebase.push(setMessage)

            var listJob = JSON.parse(replay)
            // send history to firebase
            // for (i = 0; i < 5; i++) {
            //   dbFirebase.push({
            //     ...setMessage, message: {
            //       text: [`nama lowongan: ${listJob[i].title}`]
            //     }
            //   })
            //   dbFirebase.push({
            //     ...setMessage, message: {
            //       text: [`Apply disini: ${listJob[i].link}`]
            //     }
            //   })
            // }

            // send response to client
            res.send(setMessage)
           } else { 

              var responseRejection = {
                ...response.output,
                text: [`Maaf Jofi tidak menemukan hasil pencarian terakhir kamu`]
              }

              // send response from watson to firebase
              setMessage.message = responseRejection
              dbFirebase.push(setMessage)

              // send response to client
              res.send(setMessage)
           }
        })
      } else if (response.output.action.type === "clear_history") {

        console.log('clear history')
        dbFirebase.set({})
        dbFirebase.push({ ...setMessage, message: {...response.output, text: ['Sudah jofi bersihkan komandan']} })

        res.send({ ...setMessage, message: response.output })
      } else if(response.output.action.type === "get_job") {
        getJobList(response.output.action, function (listJob) {   
          console.log(listJob)       
          if(!listJob) {
            if (response.output.action.expert && response.output.action.location ) {
              var responseWithListJob = {
                ...response.output,
                text: [`Duh maaf Jofi tidak bisa menemukan pekerjaan bidang ${response.output.action.expert} di ${response.output.action.location}`]
              }
            } else if (response.output.action.expert) {
              var responseWithListJob = {
                ...response.output,
                text: [`Maaf Jofi tidak bisa menemukan pekerjaan bidang ${response.output.action.expert} yang kamu cari`]
              }
            } else {
              var responseWithListJob = {
                ...response.output,
                text: [`Maaf Jofi tidak bisa menemukan pekerjaan yang kamu cari`]
              }
            }

            // save context to redis
            setContext(req.params.id, { ...response.context })

            // send response from watson to firebase
            setMessage.message = responseWithListJob
            dbFirebase.push(setMessage)

            // send response to client
            res.send(setMessage)
          } else {
            // save context to redis
            setContext(req.params.id, { ...response.context })
            setLogSearchJob(req.params.id, listJob)

            // setup new response 
            let responseWithListJob = {
              ...response.output,
              job: listJob,
              text: ['Berikut daftar pekerjaan yang kamu inginkan']
            }

            // send response from watson to firebase
            setMessage.message = responseWithListJob
            dbFirebase.push(setMessage)

            // send lowongan 

            // for (i = 0; i < 5; i++) {
            //   dbFirebase.push({
            //     ...setMessage, message: {
            //       text: [`nama lowongan: ${listJob[i].title}`]
            //     }
            //   })
            //   dbFirebase.push({
            //     ...setMessage, message: {
            //       text: [`Apply disini: ${listJob[i].link}`]
            //     }
            //   })
            // }

            dbFirebase.push({
              ...setMessage, message: {
                text: ['Kamu bisa cari kerja lagi dengan menyebutkan bidang dan lokasi yang kamu inginkan, atau menyudahi ini saja T.T']
              }
            })

            // send response to client
            res.send(responseWithListJob)
          }
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


