'use strict';

module.exports = function(Weather) {
  Weather.disableRemoteMethodByName('deleteById');
  Weather.disableRemoteMethodByName('count');
  Weather.disableRemoteMethodByName('upsert');
  //Weather.disableRemoteMethodByName('updateAll');
  //Weather.disableRemoteMethodByName('find');
  //Weather.disableRemoteMethodByName('findById');
  //Weather.disableRemoteMethodByName('findOne');
  Weather.currentTemp = function(cb) {
    var response;
    response = Weather.findOne({fields:['tempF']}, function (err, models) {
    cb(null, models.tempF);
  });
  };
  Weather.remoteMethod(
    'currentTemp', {
      http: {
        path: '/currentTemp',
        verb: 'get',
      },
      returns: {
        arg: 'currentTemp',
        type: 'string',
      },
    }
  );
};
