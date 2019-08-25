

module.exports = function () {
  var commands = {
    OAuth({ callbackURL }) {
      return `https://s.rokidcdn.com/homebase/upload/S1lKP_q1BS.html?callbackURL=${encodeURIComponent(callbackURL)}`
    }
  }

  return (command, params) => {
    if (typeof commands[command] === 'function') {
      return Promise.resolve()
        .then(() => commands[command](params))
    } else {
      return Promise.reject(new Error(`command ${command} not support.`))
    }
  }
}