/*
 *  LittleBitsInputBoolean.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('LittleBitsInputBoolean')
    .facet(":toy")
    .name("LittleBits Input Boolean")
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
            console.log("LittleBitsInputBoolean:data_in", paramd);
        },

        data_out: function(paramd) {
        },
    },
};
