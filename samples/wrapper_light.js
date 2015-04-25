/*
 *  For reference only. 
 *  Prefer the way 'iotdb*.js' does this.
 *
 *  See README.md for how to 
 */

"use strict";

var iotdb = require("iotdb");
var _ = iotdb._;

var ModelBinding = require('../models/LittleBitsLight');

var wrapper = _.bridge_wrapper(ModelBinding.binding, {});
wrapper.on('bridge', function (bridge) {
    console.log("+ discovered\n ", _.ld.compact(bridge.meta()));

    var count = 0;
    setInterval(function () {
        count += 10;
        bridge.push({
            brightness: count % 100
        });
    }, 1500);
});
wrapper.on('state', function (bridge, state) {
    console.log("+ state", state);
});
wrapper.on('meta', function (bridge) {
    console.log("+ meta", _.ld.compact(bridge.meta()));
});
wrapper.on('disconnected', function (bridge) {
    console.log("+ disconnected", _.ld.compact(bridge.meta()));
});
