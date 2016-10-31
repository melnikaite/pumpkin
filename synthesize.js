var googleTTS = require('google-tts-api'),
    request   = require('request'),
    watson    = require('watson-developer-cloud'),
    cp        = require('child_process'),
    play;

exports.text = function (text, callback) {
  cp.execSync('pkill -f play');

  if (process.env.TTS == 'WATSON') {
    play = cp.spawn('play', ['-t', 'flac', '-']);
    var text_to_speech = watson.text_to_speech({
      username: process.env.TTS_USERNAME,
      password: process.env.TTS_PASSWORD,
      version: 'v1'
    });

    var params = {
      text: text,
      voice: process.env.TTS_VOICE,
      accept: 'audio/flac'
    };

    text_to_speech.synthesize(params).pipe(play.stdin);
  }

  if (process.env.TTS == 'GOOGLE') {
    play = cp.spawn('play', ['-t', 'mp3', '-']);
    googleTTS(text, process.env.TTS_LANG, 1)
      .then(function (url) {
        request.get({
          url: url,
          headers: {
            'Referer': 'https://translate.google.com/',
            'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)'
          }
        }).pipe(play.stdin);
      });
  }

  play.on('close', callback);
};
