var Cleverbot = require('cleverbot-node');
cleverbot = new Cleverbot;
exports.ask = function (cleverMessage, callback) {
  Cleverbot.prepare(function () {
    cleverbot.write(cleverMessage, callback);
  });
};
