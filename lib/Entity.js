function Entity(hbinfo, hasscallinfo) {
  this.hbinfo = hbinfo;
  this.hasscallinfo = hasscallinfo;
}

Entity.prototype.transform = function(state) {
  var hbinfo = this.hbinfo;
  var type = this.hbinfo.get_type(state);
  return {
    deviceInfo: {
      domain: state.entity_id.split('.')[0],
      entityid: state.entity_id,
      supported_features: state.attributes.supported_features || 0
    },
    type: this.hbinfo.get_type(state),
    deviceId: this.hbinfo.get_device_id(state),
    name: this.hbinfo.get_name(state),
    actions: this.hbinfo.get_actions(state),
    state: this.hbinfo.get_states(state),
    offline: false
  };
}

Entity.prototype.execute = function(hass, deviceinfo, action) {
  var domain = deviceinfo.domain;
  var entityid = deviceinfo.entityid;
  var service = this.hasscallinfo.action_to_service(action);

  return hass.states.get(domain, entityid)
    .then(state => {
      var data = this.hasscallinfo.action_to_data(action, state);
      if (!data.entity_id)
        data.entity_id = entityid;
      return hass.services.call(service, domain, data);
    })
    .catch(err => {
      console.error("Get hass entities execute error: %s", err);
    })
}

Entity.prototype.get = function(hass, deviceinfo) {
  var domain = deviceinfo.domain;
  var entityid = deviceinfo.entityid;

  return hass.states.get(domain, entityid)
    .then(state => {
      return this.hbinfo.get_states(state);
    })
    .then(state => state)
    .catch(err => {
      console.error("Get hass entities state error: %s", err);
    })
}

module.exports = Entity;
