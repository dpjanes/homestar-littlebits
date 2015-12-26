/*
 *  LittleBitsInputRange.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-24
 */

exports.binding = {
    bridge: require('../LittleBitsBridge').Bridge,
    model: require('./LittleBitsInputRange.json'),
    connectd: {
        subscribes: [
            "amplitude",
        ],

        data_in: function (paramd) {
            console.log("LittleBitsInputRange:data_in", paramd);
        },

        data_out: function (paramd) {},
    },
};
