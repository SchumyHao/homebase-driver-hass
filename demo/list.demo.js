var d = require('../index')();

d.list({
  "userId": "hass-oauth2",
  "userToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZmYyMGU3YjYxN2U0M2RkOTg1NmViMzZlZDZkMzFiZCIsImlhdCI6MTU2NzMyNzYxNywiZXhwIjoxNTY3MzI5NDE3fQ.hmJrhs8rAu3la8D4gByYeBMkF-LkzkLmBcQojBmsMeQ",
  "refreshToken": "cb301642f1f50a85da5790df44970655f8cde7a0dfc1936713cb74d05ccc3aecd8da2e97c3ace07c3d93e3d572043831c4938bd0656880469fc7639fcda57c98",
  "ext1": "http://127.0.0.1:8123",
  "ext2": "http://festive-monarch.glitch.me/",
  "ext3": "oauth2"
})
.then(result => {
  console.log(JSON.stringify(result))
})