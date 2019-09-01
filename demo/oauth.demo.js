var d = require('../index')();

d.command('refreshToken', {
  userId: 'hass-oauth2',
  userToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhNDU1YTgzYTU4MDM0MGQxOTA1ZjE0NDk1MDNhMzEwNyIsImlhdCI6MTU2NzMxMzUxMCwiZXhwIjoxNTY3MzE1MzEwfQ.WZaVPLcZgmm9r9JcRvpWbz-y3-3xs9bJ3Pwa5cA_kHs',
  expiresIn: 1800,
  refreshToken: 'b85a7420e38a0bf6a1468593010a446df11d3e4d21418fde1c7daac53d2a2b3ccd7bebee7e9d300c77d78fd5b095ab539c9a106f001332871f3b17ef681b8328',
  ext1: 'http://127.0.0.1:8123',
  ext2: 'http://10.0.0.180:5000/',
  ext3: 'oauth2'
})
.then(result => {
  console.log(JSON.stringify(result))
})