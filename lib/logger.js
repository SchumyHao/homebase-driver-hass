var util = require('util')
var _logger = {
  error: function () {
    var line = util.format.apply(this, arguments)
    console.error(new Date(), line)
  },
  info: function () {
    var line = util.format.apply(this, arguments)
    console.info(new Date(), line)
  },

  warn: function () {
    var line = util.format.apply(this, arguments)
    console.info(new Date(), line)
  },

  logger: function () {
    var line = util.format.apply(this, arguments)
    console.info(new Date(), line)
  },
}

module.exports = {
  info: function () {
    _logger.info.apply(_logger, arguments)
  },
  warn: function () {
    _logger.warn.apply(_logger, arguments)
  },
  log: function () {
    _logger.log.apply(_logger, arguments)
  },
  error: function () {
    _logger.error.apply(_logger, arguments)
  },
  setLogger: function (logger) {
    if (logger) {
      _logger = logger
    }
  }
}