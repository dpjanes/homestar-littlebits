/*
 *  LittleBitsButton.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('LittleBitsButton')
    .facet(":toy")
    .name("LittleBits Button")
    .i("on", iotdb.boolean.on)
    .make();

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: exports.Model,
    connectd: {
        subscribes: [
            "amplitude",
        ],

        data_in: function(paramd) {
            console.log("LittleBitsButton:data_in", paramd);
        },

        data_out: function(paramd) {
        },
    },
};
