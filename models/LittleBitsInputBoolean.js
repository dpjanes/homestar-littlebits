/*
 *  LittleBitsInputBoolean.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

var iotdb = require("iotdb");

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: require('./LittleBitsInputBoolean.json'),
    connectd: {
        subscribes: [
            "amplitude",
        ],

        data_in: function (paramd) {
            console.log("LittleBitsInputBoolean:data_in", paramd);
        },

        data_out: function (paramd) {},
    },
};
