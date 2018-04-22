var HassEntity = require('./Entity');

var SUPPORT_OPEN = 1;
var SUPPORT_CLOSE = 2;
var SUPPORT_SET_POSITION = 4;
var SUPPORT_STOP = 8;

var hbinfo = {
  get_type: state => {
    return 'curtain';
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
      (SUPPORT_OPEN | SUPPORT_CLOSE | SUPPORT_STOP)) {
      var action = [];
      if (supported_features & SUPPORT_OPEN)
        action.push('on');
      if (supported_features & SUPPORT_CLOSE)
        action.push('off');
      if (supported_features & SUPPORT_STOP)
        action.push('stop');

      actions.switch = action;
    }

    if (supported_features & SUPPORT_SET_POSITION)
      actions.position = ['up', 'down', 'num'];

    return actions;
  },
  get_states: state => {
    var supported_features = state.attributes.supported_features;
    var states = {};

    if (supported_features &
      (SUPPORT_OPEN | SUPPORT_CLOSE | SUPPORT_STOP)) {
      if ((state.state === 'closed') || (state.state === 'closing'))
        states.switch = 'off';
      else
        states.switch = 'on';
    }

    if (supported_features & SUPPORT_SET_POSITION) {
      states.position = state.attributes.current_position;
    }

    return states;
  },
};

var hasscallinfo = {
  action_to_service: action => {
    if (action.property === 'switch') {
      if (action.name === 'off')
        return 'close_cover';
      else if (action.name === 'on')
        return 'open_cover';
      else if (action.name === 'stop')
        return 'stop_cover';
    } else if (action.property === 'position')
      return 'set_cover_position';
    else {
      console.error("Got unsupport action property (%s)", action.property);
      return null;
    }
  },
  action_to_data: function(action, state) {
    var data = {};

    if (action.property === 'switch')
      ;
    else if (action.property === 'position') {
      var curr_pos = state.attributes.current_position;
      var target_pos = 0;
      if (action.name === 'num')
        target_pos = action.value;
      else if (action.name === 'up')
        target_pos = curr_pos + 10;
      else if (action.name === 'down')
        target_pos = curr_pos - 10;
      target_pos = (target_pos > 100)? 100: target_pos;
      target_pos = (target_pos < 0)? 0: target_pos;
      data.position = target_pos;
    } else {
      console.error("Got unsupport action property (%s)", action.property);
      return null;
    }

    return data;
  }
};

module.exports = new HassEntity(hbinfo, hasscallinfo);
