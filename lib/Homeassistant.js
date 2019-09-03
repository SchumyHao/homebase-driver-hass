var http = require('http');
var https = require('https');
var url = require('url')
var TYPE_PASSOWRD = 'password'
var TYPE_OAUTH2 = 'oauth2'
var TYPE_LONG_LIVE_TOKEN = 'longLiveToken'
var Bearer = 'Bearer'
var Password = 'Password'

/**
 * user Auth 兼容 password 和 oauth2 token and long refreshToken
 * user token 因为刷新token问题， 所以暂时不实现
 * @param {object} userAuth homebase userAuth object
 * @param {string} userId hassUrl in v1
 * @param {string} userToken
 * @param {string} refreshToken
 * @param {string} ext1 hassURL
 * @param {string} ext2
 * @param {string} ext3
 */
function Homeassistant(userAuth) {
  this.authType = (userAuth.ext3 === TYPE_OAUTH2 || userAuth.ext3 === TYPE_LONG_LIVE_TOKEN) ? Bearer : Password
  this.hassURL = userAuth.ext1 || userAuth.userId
  this.password = this.authType === TYPE_PASSOWRD ? userAuth.userToken : null
  this.accessToken = userAuth.userToken
  this.userAuth = userAuth
  this.parsedURL = url.parse(this.hassURL)
}

Homeassistant.prototype._request = function (method, path, body, options) {
  return new Promise((resolve, reject) => {
    options = Object.assign({
      method: method,
      hostname: this.parsedURL.hostname,
      port: this.parsedURL.port,
      path: path,
      headers: {}
    }, options || {})

    if (this.authType === Password) {
      options.headers['x-ha-access'] = this.password;
    } else if (this.authType === Bearer) {
      options.headers['Authorization'] = 'Bearer ' + this.accessToken;
    }

    if (method !== 'GET' && typeof body !== 'undefined') {
      options.headers['Content-Length'] = Buffer.byteLength(body, 'utf8');
    }

    var webentity = this.parsedURL === 'https:' ? https : http

    var req = webentity.request(options, (res) => {
      var chunks = '';
      res.on('data', (chunk) => {
        if (chunk != undefined)
          chunks += chunk;
      });
      res.on('end', () => {
        var data
        try {
          data = JSON.parse(chunks);
          return resolve(data)
        } catch (e) {
          console.error(e.message);
          // return resolve(chunks);
        }
        if (res.statusCode >= 400) {
          var error = new Error('Status Code ' + res.statusCode)
          if (res.statusCode === 401) {
            error.errorName = 'E_DRIVER_SIGN_ERROR' // 授权失败
          }
          error.body = chunks
          error.data = data
          error.debugInfo = chunks
          return reject(error)
        }
        return resolve(chunks);
      });
      res.on('error', (e) => {
        req.end();
        return reject(new Error('problem with request: ' + e.message));
      });
    });

    req.on('error', (e) => {
      req.end();
      return reject(new Error('problem with request: ' + e.message));
    });

    if (method !== 'GET' && typeof body !== 'undefined') {
      req.write(body);
    }
    req.end();
  });
}

Homeassistant.prototype.requestGet = function _get(path) {
  return this._request('GET', path);
}

Homeassistant.prototype.requestPost = function _post(path, body, options) {
  var bodystring = '';
  var options = options || {}
  if (typeof body === 'object' && !Array.isArray(body)) {
    try {
      bodystring = JSON.stringify(body);
      options.headers = Object.assign({
        'Content-Type': 'application/json'
      }, options.headers)
    } catch (e) {
      return Promise.reject(new Error('Invalid body JSON format provided.'));
    }
  } else if (typeof body === 'string') {
    bodystring = body;
  } else {
    return Promise.reject(new Error('Invalid body provided.'));
  }
  return this._request('POST', path, bodystring, options);
}

Homeassistant.prototype.list = function() {
  return this.requestGet('/api/states');
}

Homeassistant.prototype.get = function(domain, entityId) {
  return this.requestGet(`/api/states/${entityId}`);
}

Homeassistant.prototype.info = function() {
  return this.requestGet('/api/discovery_info');
}

Homeassistant.prototype.callService = function(service, domain, serviceData) {
  return this.requestPost(`/api/services/${domain}/${service}`, serviceData);
}

Homeassistant.prototype.authRefreshToken = function() {
  var userAuth = this.userAuth
  var body = 'grant_type=refresh_token&refresh_token=' + userAuth.refreshToken + '&client_id=' + encodeURIComponent(userAuth.ext2)
  return this.requestPost('/auth/token', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

module.exports = Homeassistant
