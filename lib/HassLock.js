var HassEntity = require('./Entity');

var SUPPORT_OPEN = 1;

var hbinfo = {
  get_type: state => {
    return 'door';
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

    if (supported_features & SUPPORT_OPEN)
      actions.switch = ['on', 'off'];
    else
      actions.switch = ['off'];

    return actions;
  },
  get_states: state => {
    var supported_features = state.attributes.supported_features;
    var states = {};

    if ((state.state === 'locked') || (state.state === 'off'))
      states.switch = 'off';
    else
      states.switch = 'on';

    return states;
  },
};

var hasscallinfo = {
  action_to_service: action => {
    if (action.property === 'switch') {
      if (action.name === 'off')
        return 'lock';
      else (action.name === 'on')
        return 'unlock';
    }
    else {
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
