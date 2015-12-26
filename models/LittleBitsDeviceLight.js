/*
 *  LittleBitsDeviceLight.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-23
 */

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: require('./LittleBitsDeviceLight.json'),
    connectd: {
        subscribes: [],

        data_in: function (paramd) {},

        data_out: function (paramd) {},
    },
};
