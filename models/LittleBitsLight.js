/*
 *  LittleBitsLight.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

var iotdb = require("iotdb");

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: require('./LittleBitsLight.json'),
    connectd: {
        subscribes: [],

        data_in: function (paramd) {},

        data_out: function (paramd) {
            if (paramd.cookd.brightness !== undefined) {
                paramd.rawd.percent = paramd.cookd.brightness;
            } else if (paramd.cookd.on !== undefined) {
                paramd.rawd.percent = paramd.cookd.on ? 100 : 0;
            }
        },
    },
};
