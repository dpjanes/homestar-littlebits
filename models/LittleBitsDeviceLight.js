/*
 *  LittleBitsDeviceLight.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-23
 */

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('LittleBitsDeviceLight')
    .facet(":toy")
    .product("http://littlebits.cc/cloud")
    .name("LittleBits Cloud DeviceLight")
    .io("color", iotdb.string.color)
    .make();

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: exports.Model,
    connectd: {
        subscribes: [],

        data_in: function (paramd) {},

        data_out: function (paramd) {},
    },
};
