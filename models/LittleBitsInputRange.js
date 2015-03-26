/*
 *  LittleBitsInputRange.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('LittleBitsInputRange')
    .facet(":toy")
    .name("LittleBits Range Input")
    .i("percent", iotdb.number.percent)
    .make();

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: exports.Model,
    connectd: {
        subscribes: [
            "amplitude",
        ],

        data_in: function(paramd) {
            console.log("LittleBitsInputRange:data_in", paramd);
        },

        data_out: function(paramd) {
        },
    },
};
