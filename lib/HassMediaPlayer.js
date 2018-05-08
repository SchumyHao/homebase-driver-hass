var HassEntity = require('./Entity');

var SUPPORT_TURN_ON = 128;
var SUPPORT_TURN_OFF = 256;

var hbinfo = {
  get_type: state => {
    return 'tv';
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
      (SUPPORT_TURN_ON | SUPPORT_TURN_OFF)) {
      var action = [];
      if (supported_features & SUPPORT_TURN_ON)
        action.push('on');
      if (supported_features & SUPPORT_TURN_OFF)
        action.push('off');

      actions.switch = action;
    }

    return actions;
  },
  get_states: state => {
    var supported_features = state.attributes.supported_features;
    var states = {};
    if (supported_features &
      (SUPPORT_TURN_ON | SUPPORT_TURN_OFF)) {
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
