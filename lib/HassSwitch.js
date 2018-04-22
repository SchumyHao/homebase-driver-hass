var HassEntity = require('./Entity');

var hbinfo = {
  get_type: state => {
    return 'switch';
  },
  get_device_id: state => {
    return state.entity_id;
  },
  get_name: state => {
    return state.attributes.friendly_name || state.entity_id;
  },
  get_actions: state => {
    var actions = {};

    actions.switch = ['on', 'off'];

    return actions;
  },
  get_states: state => {
    var states = {};

    if (state.state === 'off')
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
        return 'turn_off';
      else
        return 'turn_on';
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
