/*
 *  LittleBitsOutputRange.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: require('./LittleBitsOutputRange.json'),
    connectd: {
        subscribes: [],

        data_in: function (paramd) {},

        data_out: function (paramd) {
            if (paramd.cookd.percent !== undefined) {
                paramd.rawd.percent = paramd.cookd.percent;
            }
        },
    },
};
