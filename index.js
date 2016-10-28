var rec = require('node-record-lpcm16'),
  request = require('request');

//require('request').debug = true;

var witToken = process.env.WIT_TOKEN; // get one from wit.ai!
var bot = require('./cleverbot');
var say = require('./say');
say.active = false;

exports.parseResult = function (err, resp, body) {
  parsed = JSON.parse(body)._text;
  console.log('YOU: ' + parsed);
  if (!parsed) return;

  bot.ask(parsed, function (response) {
    say.active = true;
    console.log('BOT: ' + response.message);
    say.text(response.message, function () {
      say.active = false;
    });
  });
};

exports.stream = rec.start({silence: '1 0.1 1% -1 0.1 1%', verbose: false});

var queue = Buffer.alloc(0);

setInterval(function () {
  if (queue.length == 0) return;

  request.post({
    'url': 'https://api.wit.ai/speech',
    'headers': {
      'Authorization': 'Bearer ' + witToken,
      'Content-Type': 'audio/raw;encoding=signed-integer;bits=16;rate=16000;endian=little'
    },
    body: queue
  }, exports.parseResult);

  queue = Buffer.alloc(0);
}, 3000);

exports.stream.on('data', function (chunk) {
  if (say.active) return;
  queue = Buffer.concat([queue, chunk]);
});
