var cp = require('child_process'),
  bot = require('./cleverbot'),
  recognize = require('./recognize'),
  synthesize = require('./synthesize');

exports.parseResult = function (parsed) {
  if (!parsed) return;
  console.log('YOU: ' + parsed);
  exports.mic.kill();
  bot.ask(parsed, function (response) {
    console.log('PUMPKIN: ' + response.message);
    synthesize.text(response.message, function () {
      if(cp.execSync('pgrep -f play').toString().split('\n').length < 3) {
        exports.listen();
      }
    });
  });
};

exports.listen = function () {
  //exports.mic = cp.spawn('arecord', ['--format=S16_LE', '--rate=48000', '--channels=1']);
  exports.mic = cp.spawn('rec', ['-q', '-r', '48000', '-c', '1', '-e', 'signed-integer', '-b', '16', '-t', 'wav', '-']);
  recognize.speech(exports.mic.stdout, exports.parseResult);
};
exports.listen();
