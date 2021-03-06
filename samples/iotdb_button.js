/*
 *  How to use this module in IOTDB / HomeStar
 *  This is the best way to do this
 *  Note: to work, this package must have been installed by 'homestar install' 
 */

"use strict";

var iotdb = require('iotdb');
var iot = iotdb.iot();

var things = iot.connect('LittleBitsInputBoolean');
things.on("istate", function (thing) {
    console.log("+", thing.thing_id(), "\n ", thing.state("istate"));
});
