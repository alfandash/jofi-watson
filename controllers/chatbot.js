var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var redis = require('redis')

var client = redis.createClient()

const setContext = (id, obj) => {
  client.set(id, JSON.stringify(obj))
}

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

  client.get(req.params.id, function(err, replay) {
    if (err) {
      res.send(err)
    }
    if (replay) {
      contextRedis = JSON.parse(replay)
      message = {...message, context: contextRedis}
      console.log(message)
      // Start conversation with empty message.
      conversation.message(message, processResponse);
    } else {
      conversation.message(message, processResponse);
    }
  })

  function processResponse(err, response) {
    if (err) {
      console.error(err); // something went wrong
      return;
    }
    // Display the output from dialog, if any.
    if (response.output.text.length != 0) {
      console.log(response.output.text[0]);
      setContext(req.params.id, response.context, 'EX', 60)
      res.send(response.output.text[0])
    }
  }
}