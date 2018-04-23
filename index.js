var hass = require('./lib/Homeassistant');
var hass_climate = require('./lib/HassClimate');
var hass_vacuum = require('./lib/HassVacuum');
var hass_cover = require('./lib/HassCover');
var hass_lock = require('./lib/HassLock');
var hass_fan = require('./lib/HassFan');
var hass_light = require('./lib/HassLight');
var hass_switch = require('./lib/HassSwitch');

module.exports = function () {
  var accessories = [];

  function hass_login(userAuth) {
    var url = userAuth.userId;
    var passwd = userAuth.userToken;
    var para = {};

    para.https = (url.indexOf('https') === 0);
    para.port = parseInt(url.slice(url.lastIndexOf(':')+1));
    para.host = url.slice(url.indexOf('/')+2, url.lastIndexOf(':'));
    if (passwd)
      para.password = passwd;
    hass.constructor(para);
  }

  function get_entity_domain(entity_id) {
    return entity_id.split('.')[0];
  }

  function add_hass_entity(entity_state) {
    var entity_id = entity_state.entity_id;
    var domain = get_entity_domain(entity_id);
    var acc = {};

    if (domain === 'climate')
      acc = hass_climate.transform(entity_state);
    else if (domain === 'vacuum')
      acc = hass_vacuum.transform(entity_state);
    else if (domain === 'cover')
      acc = hass_cover.transform(entity_state);
    else if (domain === 'lock')
      acc = hass_lock.transform(entity_state);
    else if (domain === 'fan')
      acc = hass_fan.transform(entity_state);
    else if (domain === 'light')
      acc = hass_light.transform(entity_state);
    else if (domain === 'switch')
      acc = hass_switch.transform(entity_state);
    else
      console.error("%s DOMAIN is not supported yet.", domain);

    if ((acc.actions) && (Object.keys(acc.actions).length > 0)) {
      if (entity_state.attributes.rhass_type) {
        acc.deviceInfo.origin_type = acc.type;
        acc.type = entity_state.attributes.rhass_type;
        console.log("Change %s type to %s.", entity_id, acc.type);
      }
      accessories.push(acc);
      console.log("Add %s to homebase.", entity_id);
    }
  }

  function transform_hass_entities(entities_state) {
    entities_state.forEach(entity_state => {
      if (entity_state.attributes.rhass_hidden) {
          console.log("%s is hidden in hass", entity_state.entity_id);
          return true; 
      }
      add_hass_entity(entity_state);
    });
  }

  function find_accessory(deviceId) {
    var i = accessories.length;
    while (i--) {
      if (accessories[i].deviceId === deviceId)
        return accessories[i];
    }
  }

  function accessory_execute(accessory, action, hass) {
    console.log("%s excute with action: ", accessory.deviceId, action);
    var type = accessory.deviceInfo.origin_type || accessory.type;
    if (type === 'ac') {
      console.log("Execute hass_climate.");
      return hass_climate.execute(hass, accessory.deviceInfo, action);
    } else if (type === 'cleanBot') {
      console.log("Execute hass_vacuum.");
      return hass_vacuum.execute(hass, accessory.deviceInfo, action);
    } else if (type === 'curtain') {
      console.log("Execute hass_cover.");
      return hass_cover.execute(hass, accessory.deviceInfo, action);
    } else if (type === 'door') {
      console.log("Execute hass_lock.");
      return hass_lock.execute(hass, accessory.deviceInfo, action);
    } else if (type === 'fan') {
      console.log("Execute hass_fan.");
      return hass_fan.execute(hass, accessory.deviceInfo, action);
    } else if (type === 'light') {
      console.log("Execute hass_light.");
      return hass_light.execute(hass, accessory.deviceInfo, action);
    } else if (type === 'switch') {
      console.log("Execute hass_switch.");
      return hass_switch.execute(hass, accessory.deviceInfo, action);
    } else {
      return Promise.reject(new Error(`${type} type is not supported yet.`));
    }
  }

  function accessory_get_states(accessory, hass) {
    var type = accessory.deviceInfo.origin_type || accessory.type;
    if (type === 'ac') {
      console.log("Get hass_climate states.")
      return hass_climate.get(hass, accessory.deviceInfo);
    } else if (type === 'cleanBot') {
      console.log("Get hass_vacuum states.")
      return hass_vacuum.get(hass, accessory.deviceInfo);
    } else if (type === 'curtain') {
      console.log("Get hass_cover states.")
      return hass_cover.get(hass, accessory.deviceInfo);
    } else if (type === 'door') {
      console.log("Get hass_lock states.")
      return hass_lock.get(hass, accessory.deviceInfo);
    } else if (type === 'fan') {
      console.log("Get hass_fan states.")
      return hass_fan.get(hass, accessory.deviceInfo);
    } else if (type === 'light') {
      console.log("Get hass_light states.")
      return hass_light.get(hass, accessory.deviceInfo);
    } else if (type === 'switch') {
      console.log("Get hass_switch states.")
      return hass_switch.get(hass, accessory.deviceInfo);
    } else {
      console.error("%s type is not supported yet.", type);
      return Promise.reject(new Error("not support"));
    }
  }

  return {
    /**
     * @param userAuth
     * @returns {PromiseLike<>|Promise.<>}
     */
    list: function(userAuth) {
      hass_login(userAuth);

      return hass.states.list()
        .then(entities_state => {
          console.log("Dump hass eneities states:")
          if (entities_state === "404: Not Found")
            throw new Error(entities_state);
          console.log(entities_state);
          transform_hass_entities(entities_state);
          console.log("Dump accessories:")
          console.log(accessories);
          return accessories;
        })
        .catch(err => {
          console.error("Get hass entities states error: %s", err);
        })
    },

    /**
     * @param device
     * @param device.deviceId
     * @param device.deviceInfo
     * @param device.userAuth
     * @param device.state
     * @param action
     * @param action.property
     * @param action.name
     * @param action.value
     * @return {Promise}
     */
    execute: function(device, action) {
      hass_login(device.userAuth);

      var accessory = find_accessory(device.deviceId);

      if (!accessory) {
        console.error("Could not find accessory %s in accessories.", device.deviceId);
        return Promise.reject(new Error("no device"));
      }
      if (!accessory.actions[action.property]) {
        console.error("%s is not supported by %s.", action.property, accessory.deviceId);
        return Promise.reject(new Error("not support"));
      }
      return accessory_execute(accessory, action, hass)
        .then(() => {
          return accessory_get_states(accessory, hass)
        })
        .then(states => {
          var ret = {};
          var val = states[action.property];

          ret.property = action.property;
          if (typeof val === 'number') {
            ret.name = 'num';
            ret.value = val;
          } else {
            ret.name = states[action.property];
          }

          console.log(ret);
          return ret;
        })
        .catch(err => {
          console.error("Excute %s error: %s", action.property, err);
        })
    }
  }
};