var request = require('request'),
  watson = require('watson-developer-cloud');

//require('request').debug = true;

exports.speech = function (speech, callback) {
  if (process.env.STT == 'WATSON') {
    var speech_to_text = watson.speech_to_text({
      username: process.env.STT_USERNAME,
      password: process.env.STT_PASSWORD,
      version: 'v1'
    });

    var params = {
      content_type: 'audio/l16; rate=48000',
      continuous: true,
      interim_results: true
    };

    var recognizeStream = speech_to_text.createRecognizeStream(params);
    speech.pipe(recognizeStream);
    recognizeStream.setEncoding('utf8');
    recognizeStream.on('data', function (parsed) {
      callback(parsed);
    });
  }

  if (process.env.STT == 'WIT') {
    var queue = Buffer.alloc(0);

    setInterval(function () {
      if (queue.length == 0) return;

      request.post({
        'url': 'https://api.wit.ai/speech',
        'headers': {
          'Authorization': 'Bearer ' + process.env.STT_TOKEN,
          'Content-Type': 'audio/raw;encoding=signed-integer;bits=16;rate=48000;endian=little'
        },
        body: queue
      }).on('data', function (buffer) {
        var parsed = JSON.parse(buffer.toString())._text;
        callback(parsed);
      });

      queue = Buffer.alloc(0);
    }, process.env.STT_DELAY);

    speech.on('data', function (chunk) {
      queue = Buffer.concat([queue, chunk]);
    });
  }
};
