var Hass = require('./lib/Homeassistant');
var hass_climate = require('./lib/HassClimate');
var hass_climate_before_096 = require('./lib/HassClimateBefore096');
var hass_vacuum = require('./lib/HassVacuum');
var hass_cover = require('./lib/HassCover');
var hass_lock = require('./lib/HassLock');
var hass_fan = require('./lib/HassFan');
var hass_light = require('./lib/HassLight');
var hass_switch = require('./lib/HassSwitch');
var hass_automation = require('./lib/HassAutomation');
var hass_input_boolean = require('./lib/HassInputBoolean');
var hass_media_player = require('./lib/HassMediaPlayer');
var hass_remote = require('./lib/HassRemote');
var hass_script = require('./lib/HassScript');

// var hassurl;
// var hasspasswd;

var hass_default_hidden_domain = ['automation'];

module.exports = function () {
  var accessories = [];

  function get_entity_domain(entity_id) {
    return entity_id.split('.')[0];
  }

  function versionGE(version, target) {
    var targetV = target.split('.');
    var v = version.split('.');
    targetV[2] = targetV[2] || '0';
    v[2] = v[2] || '0';
    if (v[0] - targetV[0] < 0) return false;
    if (v[1] - targetV[1] < 0) return false;
    if (v[2] - targetV[2] < 0) return false;
  }

  function add_hass_entity(entity_state, version) {
    var entity_id = entity_state.entity_id;
    var domain = get_entity_domain(entity_id);
    var acc = {};

    if (domain === 'climate')
      if (versionGE(version, '0.96'))
        acc = hass_climate.transform(entity_state);
      else
        acc = hass_climate_before_096.transform(entity_state);
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
    else if (domain === 'automation')
      acc = hass_automation.transform(entity_state);
    else if (domain === 'input_boolean')
      acc = hass_input_boolean.transform(entity_state);
    else if (domain === 'media_player')
      acc = hass_media_player.transform(entity_state);
    else if (domain === 'remote')
      acc = hass_remote.transform(entity_state);
    else if (domain === 'script')
      acc = hass_script.transform(entity_state);
    else
      console.error("%s DOMAIN is not supported yet.", domain);

    if ((acc.actions) && (Object.keys(acc.actions).length > 0)) {
      if (entity_state.attributes.rhass_type) {
        acc.deviceInfo.origin_type = acc.type;
        acc.type = entity_state.attributes.rhass_type;
        console.log("Change %s type to %s.", entity_id, acc.type);
      }
      if (entity_state.attributes.rhass_name) {
        acc.deviceInfo.origin_name = acc.name;
        acc.name = entity_state.attributes.rhass_name;
        console.log("Change %s name to %s.", entity_id, acc.name);
      }
      if (entity_state.attributes.rhass_room) {
        acc.roomName = entity_state.attributes.rhass_room;
        console.log("Add room name %s to %s.", acc.name, entity_id);
      }
      if (entity_state.state === 'unavailable') {
        acc.offline = true;
        console.log("%s is offline.", entity_id);
      }
      accessories.push(acc);
      console.log("Add %s to homebase.", entity_id);
    }
  }

  function transform_hass_entities(entities_state, version) {
    entities_state.forEach(entity_state => {
      var entity_id = entity_state.entity_id;
      var domain = get_entity_domain(entity_id);
      var hidden = false;

      if (hass_default_hidden_domain.indexOf(domain) >= 0) {
        if (entity_state.attributes.rhass_show)
          hidden = false;
        else
          hidden = true;
      } else {
        if (entity_state.attributes.rhass_hidden)
          hidden = true;
        else
          hidden = false;
      }

      if (hidden)
        console.log("%s is hidden in hass", entity_id);
      else
        add_hass_entity(entity_state, version);
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
      if (versionGE(hass.version, '0.96'))
        return hass_climate.execute(hass, accessory.deviceInfo, action);
      else
        return hass_climate_before_096.execute(hass, accessory.deviceInfo, action);
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
      var domain = accessory.deviceInfo.domain;
      if (domain === 'switch') {
        console.log("Execute hass_switch.");
        return hass_switch.execute(hass, accessory.deviceInfo, action);
      } else if (domain === 'input_boolean') {
        console.log("Execute hass_input_boolean.");
        return hass_input_boolean.execute(hass, accessory.deviceInfo, action);
      }
    } else if (type === 'scene') {
      console.log("Execute hass_automation.");
      return hass_automation.execute(hass, accessory.deviceInfo, action);
    } else if (type === 'tv') {
      console.log("Execute hass_media_player.");
      return hass_media_player.execute(hass, accessory.deviceInfo, action);
    } else if (type === 'remoteController') {
      console.log("Execute hass_remote.");
      return hass_remote.execute(hass, accessory.deviceInfo, action);
    } else if (type === 'scene') {
      console.log("Execute hass_script.");
      return hass_script.execute(hass, accessory.deviceInfo, action);
    } else {
      return Promise.reject(new Error(`${type} type is not supported yet.`));
    }
  }

  function accessory_get_states(accessory, hass) {
    var type = accessory.deviceInfo.origin_type || accessory.type;
    if (type === 'ac') {
      console.log("Get hass_climate states.")
      if (versionGE(hass.version, '0.96'))
        return hass_climate.get(hass, accessory.deviceInfo);
      else
        return hass_climate_before_096.get(hass, accessory.deviceInfo);
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
      var domain = accessory.deviceInfo.domain;
      if (domain === 'switch') {
        console.log("Get hass_switch states.")
        return hass_switch.get(hass, accessory.deviceInfo);
      } else if (domain === 'input_boolean') {
        console.log("Get hass_input_boolean states.")
        return hass_input_boolean.get(hass, accessory.deviceInfo);
      }
    } else if (type === 'scene') {
      console.log("Get hass_automation states.")
      return hass_automation.get(hass, accessory.deviceInfo);
    } else if (type === 'tv') {
      console.log("Get hass_media_player states.")
      return hass_media_player.get(hass, accessory.deviceInfo);
    } else if (type === 'remoteController') {
      console.log("Get hass_remote states.")
      return hass_remote.get(hass, accessory.deviceInfo);
    } else if (type === 'scene') {
      console.log("Get hass_script states.")
      return hass_script.get(hass, accessory.deviceInfo);
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
      var hass = new Hass(userAuth);
      accessories.length = 0;
      return hass.info()
        .then(info => {
          hass.version = info.version;
        })
        .then(() => {
          return hass.list()
        })
        .then(entities_state => {
          console.log("Dump hass eneities states:")
          if (entities_state === "404: Not Found")
            throw new Error(entities_state);
          console.log(entities_state);
          transform_hass_entities(entities_state, hass.version);
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
      var hass = new Hass(device.userAuth);

      return hass.info()
        .then(info => {
          hass.version = info.version;
        })
        .then(() => {
          if (accessories.length > 0) {
            return Promise.resolve();
          } else {
            console.log("Accessories are empty, list them first.")

            return hass.list()
              .then(entities_state => {
                if (entities_state === "404: Not Found")
                  return Promise.reject(new Error("404: Not Found"));
                transform_hass_entities(entities_state, hass.version);
              })
          }
        })
        .then(() => {
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
          })
    },

    command: require('./lib/command.js')()
  }
};
