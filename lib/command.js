
var Homeassistant = require('./Homeassistant')

module.exports = function () {
  var commands = {
    OAuth({ callbackURL }) {
      return `https://s.rokidcdn.com/homebase/upload/SJwcaAOSB.html?callbackURL=${encodeURIComponent(callbackURL)}`
    },


    /**
     * 
     * @param {object} userAuth user auth object
     * @param {string} userId
     * @param {string} userToken
     * @param {string} refreshToken
     * @param {string} ext1 hassUrl
     * @param {string} ext2 clientId
     */
    refreshToken(userAuth) {
      var hass = new Homeassistant(userAuth)
      return hass.authRefreshToken()
        .then(result => {
          return Object.assign({}, userAuth, {
            userToken: result.access_token,
            expiresIn: 1800,
          })
        })
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