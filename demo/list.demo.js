var d = require('../index')();

d.list({
  userId: 'hass-oauth2',
  userToken:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMmRmNWE4NjAyMTU0YjI2OTA0OGY5NzViODEzZmE5ZiIsImlhdCI6MTU2NzMyNTY1MywiZXhwIjoxNTY3MzI3NDUzfQ.dURoYbHHLJb6ZCMDkLr6ifSrzx6-UcVKIU4hDg6J1S8',
  refreshToken:
    'c9ab3eda1f233a7be4de1791bad7f91bab966893e55089109cc797daab7fae10d9493b0c8f3aba56c7d61e22b2b701abf96d3437c65a0b1488337aee4a5ed754',
  ext1: 'http://10.0.0.180:8123',
  ext2: 'http://festive-monarch.glitch.me/',
  ext3: 'oauth2'
})
.then(result => {
  console.log(JSON.stringify(result))
})