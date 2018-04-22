var HassEntity = require('./Entity');

var SUPPORT_TURN_ON = 1;
var SUPPORT_TURN_OFF = 2;
var SUPPORT_PAUSE = 4;
var SUPPORT_STOP = 8;
var SUPPORT_RETURN_HOME = 16;
var SUPPORT_FAN_SPEED = 32;
var SUPPORT_BATTERY = 64;
var SUPPORT_STATUS = 128;
var SUPPORT_SEND_COMMAND = 256;
var SUPPORT_LOCATE = 512;
var SUPPORT_CLEAN_SPOT = 1024;
var SUPPORT_MAP = 2048;

var hbinfo = {
  get_type: state => {
    return 'cleanBot';
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
    if (supported_features &
      (SUPPORT_TURN_ON | SUPPORT_TURN_OFF | SUPPORT_PAUSE | SUPPORT_STOP)) {
      var action = [];
      if (supported_features & SUPPORT_TURN_ON)
        action.push('on');
      if (supported_features & SUPPORT_TURN_OFF)
        action.push('off');
      if (supported_features & (SUPPORT_PAUSE | SUPPORT_STOP))
        action.push('stop');

      actions.switch = action;
    }

    return actions;
  },
  get_states: state => {
    var supported_features = state.attributes.supported_features;
    var states = {};
    if (supported_features &
      (SUPPORT_TURN_ON | SUPPORT_TURN_OFF | SUPPORT_PAUSE | SUPPORT_STOP)) {
      if (state.state === 'off')
        states.switch = 'off';
      else
        states.switch = 'on';
    }

    return states;
  },
};

var hasscallinfo = {
  action_to_service: action => {
    if (action.property === 'switch') {
      if (action.name === 'on')
        return 'turn_on';
      else if (action.name === 'off')
        return 'turn_off';
      else if (action.name === 'stop')
        return 'stop';
    } else {
      console.error("Got unsupport action property (%s)", action.property);
      return null;
    }
  },
  action_to_data: function(action, state) {
    var data = {};

    if (action.property === 'switch')
      ;
    else {
      console.error("Got unsupport action property (%s)", action.property);
      return null;
    }

    return data;
  }
};

module.exports = new HassEntity(hbinfo, hasscallinfo);
