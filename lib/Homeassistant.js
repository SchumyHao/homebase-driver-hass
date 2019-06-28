var http = require('http');
var https = require('https');

var host;
var port;
var password;
var apiConfig;
var webentity;

function _request(method, path, body) {
  return new Promise(function(resolve, reject) {
    var options = {
      method: method,
      hostname: host,
      port: port,
      path: `/api${path}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (apiConfig.password) {
      options.headers['x-ha-access'] = apiConfig.password;
      options.headers['Authorization'] = 'Bearer '+apiConfig.password;
    }

    if (method !== 'GET' && typeof body !== 'undefined') {
      options.headers['Content-Length'] = Buffer.byteLength(body, 'utf8');
    }

    var req = webentity.request(options, (res) => {
      var chunks = '';
      res.on('data', (chunk) => {
        if (chunk != undefined)
          chunks += chunk;
      });
      res.on('end', () => {
        try {
          chunks = JSON.parse(chunks);
        } catch (e) {
          console.error(e.message);
          return resolve(chunks);
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
};

function _get(path) {
  return _request('GET', path);
}

function _post(path, body) {
  var bodystring = '';
  if (typeof body === 'object' && !Array.isArray(body)) {
    try {
      bodystring = JSON.stringify(body);
    } catch (e) {
      return Promise.reject(new Error('Invalid body JSON format provided.'));
    }
  } else if (typeof body === 'string') {
    bodystring = body;
  } else {
    return Promise.reject(new Error('Invalid body provided.'));
  }
  return _request('POST', path, bodystring);
}

module.exports = {
  constructor: auth => {
    auth = auth || {};
    host = auth.host || 'http://localhost';
    port = auth.port || 8123;
    password = auth.password;
    apiConfig = {
      base: `${host}:${port}`,
      password: password
    };
    webentity = (auth.https)? https: http;
  },
  states: {
    list: function() {
      return _get('/states');
    },
    get: function(domain, entityId) {
      return _get(`/states/${entityId}`);
    }
  },
  services: {
    call: function(service, domain, serviceData) {
      return _post(`/services/${domain}/${service}`, serviceData);
    }
  }
}
