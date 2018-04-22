var HassEntity = require('./Entity');

var SUPPORT_BRIGHTNESS = 1;
var SUPPORT_COLOR_TEMP = 2;
var SUPPORT_EFFECT = 4;
var SUPPORT_FLASH = 8;
var SUPPORT_COLOR = 16;
var SUPPORT_TRANSITION = 32;
var SUPPORT_WHITE_VALUE = 128;

function padZero (num) {
  var length = num.toString(16).length;
  for(var i = length; i < 6; i++) {
     num = '0' + num.toString(16);
  }
  return num;
}

function rgb2hex (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

function hex2rgb (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

var hbinfo = {
  get_type: state => {
    return 'light';
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

    if (supported_features & SUPPORT_COLOR)
      actions.color = ['num'];

    if (supported_features & SUPPORT_BRIGHTNESS)
      actions.brightness = ['up', 'down', 'max', 'min', 'num']

    if (supported_features & SUPPORT_COLOR_TEMP)
      actions.color_temperature = ['up', 'down', 'max', 'min', 'num']

    return actions;
  },
  get_states: state => {
    var supported_features = state.attributes.supported_features;
    var states = {};

    if (state.state === 'off')
      states.switch = 'off';
    else
      states.switch = 'on';

    if (supported_features & SUPPORT_COLOR) {
      if (state.attributes.rgb_color != undefined)
        states.color = parseInt(rgb2hex(state.attributes.rgb_color), 16);
      else
        states.color = null;
    }

    if (supported_features & SUPPORT_BRIGHTNESS) {
      if (state.attributes.brightness != undefined)
        states.brightness = Math.floor(state.attributes.brightness*100/255);
      else
        states.brightness = null;
    }

    if (supported_features & SUPPORT_COLOR_TEMP) {
      if ((state.attributes.max_mireds != undefined) &&
        (state.attributes.min_mireds != undefined) &&
        (state.attributes.color_temp != undefined)) {
        var max = state.attributes.max_mireds;
        var min = state.attributes.min_mireds;
        var curr = state.attributes.color_temp;
        states.color_temperature = Math.floor((curr-min)*100/(max-min));
      } else
        states.color_temperature = null;
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
    } else if ((action.property === 'color') ||
              (action.property === 'brightness') ||
              (action.property === 'color_temperature'))
      return 'turn_on';
    else {
      console.error("Got unsupport action property (%s)", action.property);
      return null;
    }
  },
  action_to_data: function(action, state) {
    var data = {};

    if (action.property === 'switch')
      ;
    else if (action.property === 'color') {
      if (action.name === 'num')
        data.rgb_color = hex2rgb(padZero(action.value));
    } else if (action.property === 'brightness') {
      var brightness = state.attributes.brightness;

      if (action.name === 'up') {
        var target = brightness + 25;
        target = (target > 255)? 255: target;
        data.brightness = target;
      } else if (action.name === 'down') {
        var target = brightness - 25;
        target = (target < 0)? 0: target;
        data.brightness = target;
      } else if (action.name === 'max') {
        data.brightness = 255;
      } else if (action.name === 'min') {
        data.brightness = 0;
      } else if (action.name === 'num') {
        data.brightness_pct = action.value;
      }
    } else if (action.property === 'color_temperature') {
      var max = state.attributes.max_mireds;
      var min = state.attributes.min_mireds;
      var curr = state.attributes.color_temp;

      if (action.name === 'up') {
        var target = curr + 25;
        target = (target > max)? max: target;
        data.color_temp = target;
      } else if (action.name === 'down') {
        var target = curr - 25;
        target = (target < min)? min: target;
        data.color_temp = target;
      } else if (action.name === 'max') {
        data.color_temp = max;
      } else if (action.name === 'min') {
        data.color_temp = min;
      } else if (action.name === 'num') {
        data.color_temp = Math.floor(min+(action.value*(max-min)/100));
      }
    } else {
      console.error("Got unsupport action property (%s)", action.property);
      return null;
    }

    return data;
  }
};

module.exports = new HassEntity(hbinfo, hasscallinfo);
