/*
 *  LittleBitsOutputRange.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('LittleBitsOutputRange')
    .facet(":toy")
    .name("LittleBits Output Range")
    .o("percent", iotdb.number.percent)
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
            if (paramd.cookd.percent !== undefined) {
                paramd.rawd.percent = paramd.cookd.percent;
            }
        },
    },
};
