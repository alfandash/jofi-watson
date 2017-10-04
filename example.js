// Example 1: sets up service wrapper, sends initial message, and
// receives response.
var prompt = require('prompt-sync')();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: 'db8dcf97-e487-43cd-b512-f8e9bb5cfbf7', // replace with username from service key
  password: 'JZNk1HoKOlWn', // replace with password from service key
  path: { workspace_id: 'fdac2f60-aea3-442b-8bf0-029ca07e2b6f' }, // replace with workspace ID
  version_date: '2016-07-11'
});

// Start conversation with empty message.
conversation.message({}, processResponse);

// Process the conversation response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  console.log(response)

  if (response.output.action === "turn_on") {
    console.log(response.output.text[0] + new Date())
  }

  // If an intent was detected, log it out to the console.
  if (response.intents.length > 0) {
    console.log('Detected intent: #' + response.intents[0].intent);
  }

  // Display the output from dialog, if any.
  if (response.output.text.length != 0) {
    console.log(response.output.text[0]);
  }

  // Prompt for the next round of input.
  var newMessageFromUser = prompt('>> ');
  conversation.message({
    input: { text: newMessageFromUser },
    context: response.context,
  }, processResponse)
}
