/*
 *  LittleBitsLight.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('LittleBitsLight')
    .facet(":toy")
    .name("LittleBits LED")
    .io("on", iotdb.boolean.on)
    .io("brightness", iotdb.number.percent.brightness)
    .make();

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: exports.Model,
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
