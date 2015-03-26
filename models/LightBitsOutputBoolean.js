/*
 *  LittleBitsOutputBoolean.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('LittleBitsOutputBoolean')
    .facet(":toy")
    .name("LittleBits Output Boolean")
    .o("on", iotdb.boolean.on)
    .make();

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: exports.Model,
    connectd: {
        subscribes: [
        ],

        data_in: function(paramd) {
        },

        data_out: function(paramd) {
            if (paramd.cookd.on !== undefined) {
                paramd.rawd.percent = paramd.cookd.on ? 100 : 0;
            }
        },
    },
};
