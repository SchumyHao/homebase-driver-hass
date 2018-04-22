var http = require('http');

var host;
var port;
var password;
var apiConfig;

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
    }

    var req = http.request(options, (res) => {
      var body = '';
      //res.setEncoding('utf8');
      res.on('data', (chunk) => {
        if (chunk != undefined)
          body += chunk;
      });
      res.on('end', () => {
        try {
          body = JSON.parse(body);
        } catch (e) {
          console.error(e.message);
          return resolve(body);
        }
        
        return resolve(body);
      });
    });

    req.on('error', (e) => {
      return reject(new Error('problem with request: %s', e));
    });

    if (method !== 'GET' && typeof body !== 'undefined') {
      var bodystring = '';
      if (typeof body === 'object' && !Array.isArray(body)) {
        try {
          bodystring = JSON.stringify(body);
        } catch (e) {
          return reject(new Error('Invalid body JSON format provided.'));
        }
      } else if (typeof body === 'string') {
        bodystring = body;
      } else {
        return reject(new Error('Invalid body provided.'));
      }
      req.write(bodystring);
    }
    req.end();
  });
};


function __request(method, path, body) {
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
    }

    console.log("start request")
    var req = http.request(options, (res) => {
      var body = [];
      if (res.statusCode < 200 || res.statusCode > 299) {
        reject(new Error('Failed to load page, status code: ' + res.statusCode));
      }
      //res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log("Request data")
        body.push(chunk)
      });
      res.on('end', () => {
        console.log("Request end")
        body = body.join('')
        try {
          body = JSON.parse(body);
        } catch (e) {
          console.error(e.message);
        }
        return resolve(body);
      });
    });

    console.log("start on error")
    req.on('error', (e) => {
      return reject(new Error('problem with request: %s', e));
    });

    console.log("start POST")
    if (method !== 'GET' && typeof body !== 'undefined') {
      var bodystring = '';
      if (typeof body === 'object' && !Array.isArray(body)) {
        try {
          bodystring = JSON.stringify(body);
        } catch (e) {
          return reject(new Error('Invalid body JSON format provided.'));
        }
      } else if (typeof body === 'string') {
        bodystring = body;
      } else {
        return reject(new Error('Invalid body provided.'));
      }
      req.write(bodystring, (e)=>{console.log("write end: ", e)});
    }

    console.log("start end")
    req.end((e)=>{console.log("end end: ",e)});
  });
};


function __get(path) {
  return __request('GET', path);
}

function _get(path) {
  return _request('GET', path);
}

function _post(path, body) {
  return _request('POST', path, body);
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
  },
  states: {
    list: function() {
      return _get('/states');
    },
    get: function(domain, entityId) {
      return __get(`/states/${entityId}`);
    }
  },
  services: {
    call: function(service, domain, serviceData) {
      if (typeof serviceData === 'string') {
        if (!(serviceData.indexOf(domain) === 0)) {
          serviceData = `${domain}.${serviceData}`;
        }
        serviceData = {
          entity_id: serviceData
        };
      }

      return _post(`/services/${domain}/${service}`, serviceData);
    }
  }
}