var googleTTS = require('google-tts-api'),
    request = require('request');

exports.text = function (text, callback) {
  googleTTS(text, 'ru', 1)
    .then(function (url) {
      var play = require('child_process').spawn('play', ['-t', 'mp3', '-']);
      request.get({
        url: url,
        headers: {
          'Referer': 'https://translate.google.com/',
          'User-Agent': 'stagefright/1.2 (Linux;Android 5.0)'
        }
      }).pipe(play.stdin);
      play.on('close', callback);
    });
};
