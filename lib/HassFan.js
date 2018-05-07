var HassEntity = require('./Entity');

var SUPPORT_SET_SPEED = 1;
var SUPPORT_OSCILLATE = 2;
var SUPPORT_DIRECTION = 4;

var FAN_SPEED_LIST = ['off', 'low', 'medium', 'high'];

var hbinfo = {
  get_type: state => {
    return 'fan';
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

    actions.switch = ['on', 'off'];

    if (supported_features & SUPPORT_OSCILLATE)
      actions.swing_mode = ['on', 'off'];

    if (supported_features & SUPPORT_SET_SPEED) {
      var speed_list = state.attributes.speed_list;

      if (speed_list) {
        var i=0;

        for (i=0; i<speed_list.length; i++) {
          if (FAN_SPEED_LIST.indexOf(speed_list[i]) >= 0)
            continue;
          else
            break;
        }
        if (i == speed_list.length)
          actions.fanspeed = ['up', 'down', 'max', 'min'];
      }

    }

    return actions;
  },
  get_states: state => {
    var supported_features = state.attributes.supported_features;
    var states = {};

    if (state.state === 'off')
      states.switch = 'off';
    else
      states.switch = 'on';

    if (supported_features & SUPPORT_OSCILLATE) {
      if (state.attributes.oscillating)
        states.swing_mode = 'on';
      else
        states.swing_mode = 'off';
    }

    if (supported_features & SUPPORT_SET_SPEED) {
      var speed_list = state.attributes.speed_list;
      var speed = state.attributes.speed;

      if (speed_list && speed) {
        for (var i=0; i<speed_list.length; i++) {
          if (speed_list[i] === speed)
            states.fanspeed = i;
        }
      }
    }

    return states;
  },
};

var hasscallinfo = {
  action_to_service: action => {
    if (action.property === 'switch') {
      if (action.name === 'off')
        return 'turn_off';
      else
        return 'turn_on';
    } else if (action.property === 'swing_mode')
      return 'oscillate';
    else if (action.property === 'fanspeed')
      return 'set_speed';
    else {
      console.error("Got unsupport action property (%s)", action.property);
      return null;
    }
  },
  action_to_data: function(action, state) {
    var data = {};

    if (action.property === 'switch')
      ;
    else if (action.property === 'swing_mode') {
      if (action.name === 'on')
        data.oscillating = true;
      else
        data.oscillating = false;
    } else if (action.property === 'fanspeed') {
      var speed_list = state.attributes.speed_list;
      var speed = state.attributes.speed;

      if (speed_list && speed) {
        var index = FAN_SPEED_LIST.indexOf(speed);

        if (action.name === 'up') {
          for (var i = index+1; i < FAN_SPEED_LIST.length; i++) {
            if (speed_list.indexOf(FAN_SPEED_LIST[i]) >= 0) {
              data.speed = FAN_SPEED_LIST[i];
              break;
            }
          }
        } else if (action.name === 'down') {
          for (var i = index-1; i > 0; i--) {
            if (speed_list.indexOf(FAN_SPEED_LIST[i]) >= 0) {
              data.speed = FAN_SPEED_LIST[i];
              break;
            }
          }
        } else if (action.name === 'max') {
          for (var i = FAN_SPEED_LIST.length-1; i > index; i--) {
            if (speed_list.indexOf(FAN_SPEED_LIST[i]) >= 0) {
              data.speed = FAN_SPEED_LIST[i];
              break;
            }
          }
        } else if (action.name === 'min') {
          for (var i = 1; i < index; i++) {
            if (speed_list.indexOf(FAN_SPEED_LIST[i]) >= 0) {
              data.speed = FAN_SPEED_LIST[i];
              break;
            }
          }
        }
        data.speed = data.speed || speed;
      }
    } else {
      console.error("Got unsupport action property (%s)", action.property);
      return null;
    }

    return data;
  }
};

module.exports = new HassEntity(hbinfo, hasscallinfo);
