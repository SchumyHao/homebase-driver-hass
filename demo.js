var d = require('./index')();
console.info("Demo start");

var accessories;

function search() {
  console.info("Start search");
  d.list({
      userId: 'http://127.0.0.1:8123',
      userToken: 'passwd'
  })
  .then((devices) => {
    console.log('found accessories ======>')
    accessories = devices;
    onAccessaryFound();
  })
  .then(() => {
    console.log("Demo Done")
  })
  .catch(err => {
    console.error(err);
  })
}

search()

function do_test_cmd(acc, prop, name, val) {
  if ((acc.actions[prop]) &&
    (acc.actions[prop].indexOf(name) >= 0)) {
    if (val != undefined) {
      return d.execute(acc, {property: prop, name: name, value: val})
        .then((state) => {
          console.log("Done %s test %s.%s=%s, state is", acc.deviceId, prop, name, val, state);
        })
        .catch(err=>console.log(err))
    } else {
      return d.execute(acc, {property: prop, name: name})
        .then((state) => {
          console.log("Done %s test %s.%s, state is", acc.deviceId, prop, name, state);
        })
        .catch(err=> {
          console.log("Done with error *s", err);
        })
    }
  } else {
    console.log("%s not support %s.%s", acc.deviceId, prop, name);
  }
}

function ac_test(acc, seq) {
  return seq.then(() => {
    return do_test_cmd(acc, 'switch', 'off');
  })
  .then(() => {
    return do_test_cmd(acc, 'switch', 'on');
  })
  .then(() => {
    return do_test_cmd(acc, 'mode', 'auto');
  })
  .then(() => {
    return do_test_cmd(acc, 'mode', 'cool');
  })
  .then(() => {
    return do_test_cmd(acc, 'mode', 'heat');
  })
  .then(() => {
    return do_test_cmd(acc, 'mode', 'dry');
  })
  .then(() => {
    return do_test_cmd(acc, 'mode', 'fan');
  })
  .then(() => {
    return do_test_cmd(acc, 'mode', 'energy');
  })
  .then(() => {
    return do_test_cmd(acc, 'temperature', 'up');
  })
  .then(() => {
    return do_test_cmd(acc, 'temperature', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'temperature', 'max');
  })
  .then(() => {
    return do_test_cmd(acc, 'temperature', 'up');
  })
  .then(() => {
    return do_test_cmd(acc, 'temperature', 'min');
  })
  .then(() => {
    return do_test_cmd(acc, 'temperature', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'temperature', 'num', 20);
  })
  .then(() => {
    return do_test_cmd(acc, 'temperature', 'num', 100);
  })
  .then(() => {
    return do_test_cmd(acc, 'temperature', 'num', 0);
  })
  .then(() => {
    return do_test_cmd(acc, 'humidity', 'up');
  })
  .then(() => {
    return do_test_cmd(acc, 'humidity', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'humidity', 'max');
  })
  .then(() => {
    return do_test_cmd(acc, 'humidity', 'up');
  })
  .then(() => {
    return do_test_cmd(acc, 'humidity', 'min');
  })
  .then(() => {
    return do_test_cmd(acc, 'humidity', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'humidity', 'num', 20);
  })
  .then(() => {
    return do_test_cmd(acc, 'humidity', 'num', 0);
  })
  .then(() => {
    return do_test_cmd(acc, 'humidity', 'num', 100);
  })
  .catch(err=>console.log(err))
}

function cleanbot_test(acc, seq) {
  return seq.then(() => {
    return do_test_cmd(acc, 'switch', 'off');
  })
  .then(() => {
    return do_test_cmd(acc, 'switch', 'on');
  })
  .then(() => {
    return do_test_cmd(acc, 'switch', 'stop');
  })
  .catch(err=>console.log(err))
}

function curtain_test(acc, seq) {
  return seq.then(() => {
    return do_test_cmd(acc, 'switch', 'off');
  })
  .then(() => {
    return do_test_cmd(acc, 'switch', 'on');
  })
  .then(() => {
    return do_test_cmd(acc, 'switch', 'stop');
  })
  .then(() => {
    return do_test_cmd(acc, 'position', 'num', 30);
  })
  .then(() => {
    return do_test_cmd(acc, 'position', 'up');
  })
  .then(() => {
    return do_test_cmd(acc, 'position', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'position', 'num', 0);
  })
  .then(() => {
    return do_test_cmd(acc, 'position', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'position', 'num', 100);
  })
  .then(() => {
    return do_test_cmd(acc, 'position', 'up');
  })
  .catch(err=>console.log(err))
}

function door_test(acc, seq) {
  return seq.then(() => {
    return do_test_cmd(acc, 'switch', 'off');
  })
  .then(() => {
    return do_test_cmd(acc, 'switch', 'on');
  })
  .catch(err=>console.log(err))
}

function fan_test(acc, seq) {
  return seq.then(() => {
    return do_test_cmd(acc, 'switch', 'off');
  })
  .then(() => {
    return do_test_cmd(acc, 'switch', 'on');
  })
  .then(() => {
    return do_test_cmd(acc, 'swing_mode', 'on');
  })
  .then(() => {
    return do_test_cmd(acc, 'swing_mode', 'off');
  })
  .then(() => {
    return do_test_cmd(acc, 'fanspeed', 'up');
  })
  .then(() => {
    return do_test_cmd(acc, 'fanspeed', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'fanspeed', 'min');
  })
  .then(() => {
    return do_test_cmd(acc, 'fanspeed', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'fanspeed', 'max');
  })
  .then(() => {
    return do_test_cmd(acc, 'fanspeed', 'up');
  })
  .catch(err=>console.log(err))
}

function light_test(acc, seq) {
  return seq.then(() => {
    return do_test_cmd(acc, 'switch', 'off');
  })
  .then(() => {
    return do_test_cmd(acc, 'switch', 'on');
  })
  .then(() => {
    return do_test_cmd(acc, 'color', 'num', 0x00FF00);
  })
  .then(() => {
    return do_test_cmd(acc, 'brightness', 'up');
  })
  .then(() => {
    return do_test_cmd(acc, 'brightness', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'brightness', 'min');
  })
  .then(() => {
    return do_test_cmd(acc, 'brightness', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'brightness', 'max');
  })
  .then(() => {
    return do_test_cmd(acc, 'brightness', 'up');
  })
  .then(() => {
    return do_test_cmd(acc, 'brightness', 'num', 50);
  })
  .then(() => {
    return do_test_cmd(acc, 'color_temperature', 'up');
  })
  .then(() => {
    return do_test_cmd(acc, 'color_temperature', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'color_temperature', 'min');
  })
  .then(() => {
    return do_test_cmd(acc, 'color_temperature', 'down');
  })
  .then(() => {
    return do_test_cmd(acc, 'color_temperature', 'max');
  })
  .then(() => {
    return do_test_cmd(acc, 'color_temperature', 'up');
  })
  .then(() => {
    return do_test_cmd(acc, 'color_temperature', 'num', 50);
  })
  .catch(err=>console.log(err))
}

function switch_test(acc, seq) {
  return seq.then(() => {
    return do_test_cmd(acc, 'switch', 'off');
  })
  .then(() => {
    return do_test_cmd(acc, 'switch', 'on');
  })
  .catch(err=>console.log(err))
}

function onAccessaryFound() {
  var sequence = Promise.resolve();

  accessories.forEach((acc) => {
    acc.userAuth = {};
    acc.userAuth.userId = 'http://127.0.0.1:8123';
    acc.userAuth.userToken = 'passwd';
    if (acc.type === 'ac')
      sequence = ac_test(acc, sequence);
    if (acc.type === 'cleanBot')
      sequence = cleanbot_test(acc, sequence);
    if (acc.type === 'curtain')
      sequence = curtain_test(acc, sequence);
    if (acc.type === 'door')
      sequence = door_test(acc, sequence);
    if (acc.type === 'fan')
      sequence = fan_test(acc, sequence);
    if (acc.type === 'light')
      sequence = light_test(acc, sequence);
    if ((acc.type === 'switch') || (acc.type === 'socket'))
      sequence = switch_test(acc, sequence);
  })
}
