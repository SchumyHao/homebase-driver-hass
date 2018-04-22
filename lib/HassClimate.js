var HassEntity = require('./Entity');

var SUPPORT_TARGET_TEMPERATURE = 1;
var SUPPORT_TARGET_TEMPERATURE_HIGH = 2;
var SUPPORT_TARGET_TEMPERATURE_LOW = 4;
var SUPPORT_TARGET_HUMIDITY = 8;
var SUPPORT_TARGET_HUMIDITY_HIGH = 16;
var SUPPORT_TARGET_HUMIDITY_LOW = 32;
var SUPPORT_FAN_MODE = 64;
var SUPPORT_OPERATION_MODE = 128;
var SUPPORT_HOLD_MODE = 256;
var SUPPORT_SWING_MODE = 512;
var SUPPORT_AWAY_MODE = 1024;
var SUPPORT_AUX_HEAT = 2048;
var SUPPORT_ON_OFF = 4096;

var hbinfo = {
  get_type: state => {
    return 'ac';
  },
  get_device_id: state => {
    return state.entity_id;
  },
  get_name: state => {
    return state.attributes.friendly_name || state.entity_id;
  },
  get_actions: state => {
    var supported_features = state.attributes.supported_features;
    var actions = {};
    if ((supported_features & SUPPORT_ON_OFF) ||
        (supported_features & SUPPORT_OPERATION_MODE))
      actions.switch = ['on', 'off'];

    if ((supported_features & SUPPORT_OPERATION_MODE) &&
        state.attributes.operation_list) {
      var operation_list = state.attributes.operation_list;
      var mode_list = [];
      if (operation_list.indexOf('auto') >= 0)
        mode_list.push('auto');
      if (operation_list.indexOf('cool') >= 0)
        mode_list.push('cool');
      if (operation_list.indexOf('heat') >= 0)
        mode_list.push('heat');
      if (operation_list.indexOf('dry') >= 0)
        mode_list.push('dry');
      if (operation_list.indexOf('fan_only') >= 0)
        mode_list.push('fan');
      if (operation_list.indexOf('eco') >= 0)
        mode_list.push('energy');

      if (mode_list.length > 0)
        actions.mode = mode_list;
    }

    if (supported_features &
        (SUPPORT_TARGET_TEMPERATURE |
          SUPPORT_TARGET_TEMPERATURE_HIGH |
          SUPPORT_TARGET_TEMPERATURE_LOW)) {
      var temp = state.attributes.temperature ||
                  state.attributes.target_temp_low ||
                  state.attributes.target_temp_high;
      if (temp)
        actions.temperature = ['up', 'down', 'max', 'min', 'num'];
    }

    if (supported_features &
        (SUPPORT_TARGET_HUMIDITY |
          SUPPORT_TARGET_HUMIDITY_HIGH |
          SUPPORT_TARGET_HUMIDITY_LOW)) {
      var hum = state.attributes.humidity;
      if (hum)
        actions.humidity = ['up', 'down', 'max', 'min', 'num'];
    }

    return actions;
  },
  get_states: state => {
    var supported_features = state.attributes.supported_features;
    var states = {};
    if ((supported_features & SUPPORT_ON_OFF) ||
        (supported_features & SUPPORT_OPERATION_MODE)) {
      if (state.state === 'off')
        states.switch = 'off';
      else
        states.switch = 'on';
    }
    if (supported_features & SUPPORT_OPERATION_MODE) {
      var operation_mode = state.attributes.operation_mode
      if (operation_mode === 'auto')
        states.mode = 'auto';
      else if (operation_mode === 'cool')
        states.mode = 'cool';
      else if (operation_mode === 'heat')
        states.mode = 'heat';
      else if (operation_mode === 'dry')
        states.mode = 'dry';
      else if (operation_mode === 'fan_only')
        states.mode = 'fan';
      else if (operation_mode === 'eco')
        states.mode = 'energy';
    }

    if (supported_features &
        (SUPPORT_TARGET_TEMPERATURE |
          SUPPORT_TARGET_TEMPERATURE_HIGH |
          SUPPORT_TARGET_TEMPERATURE_LOW)) {
      var temp = state.attributes.temperature ||
              state.attributes.target_temp_low ||
              state.attributes.target_temp_high;
      if (temp)
        states.temperature = temp;
    }

    if (supported_features &
        (SUPPORT_TARGET_HUMIDITY |
          SUPPORT_TARGET_HUMIDITY_HIGH |
          SUPPORT_TARGET_HUMIDITY_LOW)) {
      var hum = state.attributes.humidity;
      if (hum)
        states.humidity = hum;
    }

    return states;
  },
};

var hasscallinfo = {
  action_to_service: action => {
    if (action.property === 'switch')
      if (action.name === 'on')
        return 'turn_on';
      else
        return 'turn_off';
    else if (action.property === 'mode')
      return 'set_operation_mode';
    else if (action.property === 'temperature')
      return 'set_temperature';
    else if (action.property === 'humidity')
      return 'set_humidity';
    else {
      console.error("Got unsupport action property (%s)", action.property);
      return null;
    }
  },
  action_to_data: function(action, state) {
    var data = {};

    if (action.property === 'switch')
      ;
    else if (action.property === 'mode') {
      if (action.name === 'auto')
        data.operation_mode = 'auto';
      else if (action.name === 'cool')
        data.operation_mode = 'cool';
      else if (action.name === 'heat')
        data.operation_mode = 'heat';
      else if (action.name === 'dry')
        data.operation_mode = 'dry';
      else if (action.name === 'fan')
        data.operation_mode = 'fan_only';
      else if (action.name === 'energy')
        data.operation_mode = 'eco';
    } else if (action.property === 'temperature') {
      var max_temp = state.attributes.max_temp;
      var min_temp = state.attributes.min_temp;
      var curr_temp = state.attributes.temperature ||
        state.attributes.target_temp_low ||
        state.attributes.target_temp_high;
      var target_temp = 0;
      if (action.name === 'num') {
        target_temp = action.value;
        target_temp = (target_temp > max_temp)? max_temp: target_temp;
        target_temp = (target_temp < min_temp)? min_temp: target_temp;
      } else if (action.name === 'max')
        target_temp = max_temp;
      else if (action.name === 'min')
        target_temp = min_temp;
      else if (action.name === 'up') {
        target_temp = curr_temp + 1;
        target_temp = (target_temp > max_temp)? max_temp: target_temp;
      } else if (action.name === 'down') {
        target_temp = curr_temp - 1;
        target_temp = (target_temp < min_temp)? min_temp: target_temp;
      }
      data.temperature = target_temp;
      data.target_temp_high = target_temp;
      data.target_temp_low = target_temp;
    } else if (action.property === 'humidity') {
      var max_humidity = state.attributes.max_humidity;
      var min_humidity = state.attributes.min_humidity;
      var curr_humidity = state.attributes.humidity;
      var target_humidity = 0;
      if (action.name === 'num') {
        target_humidity = action.value;
        target_humidity = (target_humidity > max_humidity)? max_humidity: target_humidity;
        target_humidity = (target_humidity < min_humidity)? min_humidity: target_humidity;
      } else if (action.name === 'max')
        target_humidity = max_humidity;
      else if (action.name === 'min')
        target_humidity = min_humidity;
      else if (action.name === 'up') {
        target_humidity = curr_humidity + 1;
        target_humidity = (target_humidity > max_humidity)? max_humidity: target_humidity;
      } else if (action.name === 'down') {
        target_humidity = curr_humidity - 1;
        target_humidity = (target_humidity < min_humidity)? min_humidity: target_humidity;
      }
      data.humidity = target_humidity;
    } else {
      console.error("Got unsupport action property (%s)", action.property);
      return null;
    }

    return data;
  }
};

module.exports = new HassEntity(hbinfo, hasscallinfo);
