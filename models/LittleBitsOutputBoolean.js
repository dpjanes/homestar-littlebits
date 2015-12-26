/*
 *  LittleBitsOutputBoolean.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: require('./LittleBitsOutputBoolean.json'),
    connectd: {
        subscribes: [],

        data_in: function (paramd) {},

        data_out: function (paramd) {
            if (paramd.cookd.on !== undefined) {
                paramd.rawd.percent = paramd.cookd.on ? 100 : 0;
            }
        },
    },
};
