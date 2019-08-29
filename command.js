

module.exports = function () {
  var commands = {
    OAuth({ callbackURL }) {
      return `http://s.rokidcdn.com/homebase/upload/HyYpFmVrr.html?callbackURL=${encodeURIComponent(callbackURL)}`
    },
    OAuthGetToken({ code }) {
      //TODO: code to userAuth
      return {
        userId: 'hassoauth',
        userToken: hello
      }
    },
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