/*
 *  LittleBitsBridge.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-03-22
 *
 *  Copyright [2013-2015] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

var iotdb = require('iotdb');
var _ = iotdb._;
var bunyan = iotdb.bunyan;

var littlebits = require('littlebits-cloud-http');

var logger = bunyan.createLogger({
    name: 'homestar-littlebits',
    module: 'LittleBitsBridge',
});

/**
 *  EXEMPLAR and INSTANCE
 *  <p>
 *  No subclassing needed! The following functions are
 *  injected _after_ this is created, and before .discover and .connect
 *  <ul>
 *  <li><code>discovered</code> - tell IOTDB that we're talking to a new Thing
 *  <li><code>pulled</code> - got new data
 *  <li><code>connected</code> - this is connected to a Thing
 *  <li><code>disconnnected</code> - this has been disconnected from a Thing
 *  </ul>
 */
var LittleBitsBridge = function (initd, native) {
    var self = this;

    self.initd = _.defaults(initd, {
        access_token: null,
        id: undefined,      // will restrict devices
        label: undefined,   // will restrict devices
        name: null,
    });
    self.native = native;

    if (self.native) {
        self.connected = {};
    }
};

/* --- lifecycle --- */

/**
 *  EXEMPLAR.
 *  Discover LittleBits Socket
 *  <ul>
 *  <li>look for Things (using <code>self.bridge</code> data to initialize)
 *  <li>find / create a <code>native</code> that does the talking
 *  <li>create an LittleBitsBridge(native)
 *  <li>call <code>self.discovered(bridge)</code> with it
 */
LittleBitsBridge.prototype.discover = function () {
    var self = this;

    self.initd.access_token = self.initd.access_token || iotdb.keystore().get("/bridges/LittleBitsBridge/account/access_token");

    if (!self.initd.access_token) {
        logger.error({
            method: "discover",
        }, "LittleBits is not configured");
        return;
    }

    var api = littlebits.defaults({
        access_token: self.initd.access_token,
        label: self.initd.label,
        id: self.initd.id,
    });

    api.devices(function(error, devices) {
        for (var di in devices) {
            var device = devices[di];
            var native = api.defaults({
                id: device.id,
            });

            var initd = _.defaults({
                id: device.id,
            }, self.initd, {
                name: device.label,
            });

            self.discovered(new LittleBitsBridge(initd, native));
        };
    });
};

/**
 *  INSTANCE
 *  This is called when this Thing is ready to be used
 */
LittleBitsBridge.prototype.connect = function (connectd) {
    var self = this;
    if (!self.native) {
        return;
    }

    self.connectd = _.defaults(connectd, {
        subscribes: [],
        data_in: function (paramd) {},
        data_out: function (paramd) {},
    });

    self._setup_events();
};

LittleBitsBridge.prototype._setup_events = function () {
    var self = this;

    for (var si in self.connectd.subscribes) {
        self._setup_event(self.connectd.subscribes[si]);
    }
};

LittleBitsBridge.prototype._setup_event = function (service_urn) {
    var self = this;

};

LittleBitsBridge.prototype._forget = function () {
    var self = this;
    if (!self.native) {
        return;
    }

    logger.info({
        method: "_forget"
    }, "called");

    self.native = null;
    self.pulled();
};

/**
 *  INSTANCE and EXEMPLAR (during shutdown).
 *  This is called when the Bridge is no longer needed. 
 */
LittleBitsBridge.prototype.disconnect = function () {
    var self = this;
    if (!self.native || !self.native) {
        return;
    }

    self._forget();
};

/* --- data --- */

/**
 *  INSTANCE.
 *  Send data to whatever you're taking to.
 */
LittleBitsBridge.prototype.push = function (pushd) {
    var self = this;
    if (!self.native) {
        return;
    }

    var paramd = {
        cookd: pushd,
        rawd: {},
    };
    self.connectd.data_out(paramd);

    logger.info({
        method: "push",
        unique_id: self.unique_id,
        pushd: pushd,
    }, "pushed");
};

/**
 *  INSTANCE.
 *  Pull data from whatever we're talking to. You don't
 *  have to implement this if it doesn't make sense
 */
LittleBitsBridge.prototype.pull = function () {
    var self = this;
    if (!self.native) {
        return;
    }
};

/* --- state --- */

/**
 *  INSTANCE.
 *  Return the metadata - compact form can be used.
 *  Does not have to work when not reachable
 *  <p>
 *  Really really useful things are:
 *  <ul>
 *  <li><code>iot:thing</code> required - a unique ID
 *  <li><code>iot:device</code> suggested if linking multiple things together
 *  <li><code>schema:name</code>
 *  <li><code>iot:number</code>
 *  <li><code>schema:manufacturer</code>
 *  <li><code>schema:model</code>
 */
LittleBitsBridge.prototype.meta = function () {
    var self = this;
    if (!self.native) {
        return;
    }

    return {
        "iot:thing": _.id.thing_urn.unique("LittleBits", self.initd.id),
        "schema:name": self.initd.name || "LittleBits",
        "schema:manufacturer": "http://littlebits.cc/",
        "schema:model": "http://littlebits.cc/cloud",
    };
};

/**
 *  INSTANCE.
 *  Return True if this is reachable. You
 *  do not need to worry about connect / disconnect /
 *  shutdown states, they will be always checked first.
 */
LittleBitsBridge.prototype.reachable = function () {
    return this.native !== null;
};

/**
 *  INSTANCE.
 *  Configure an express web page to configure this Bridge.
 *  Return the name of the Bridge, which may be
 *  listed and displayed to the user.
 */
LittleBitsBridge.prototype.configure = function (app) {};

/* --- injected: THIS CODE WILL BE REMOVED AT RUNTIME, DO NOT MODIFY  --- */
LittleBitsBridge.prototype.discovered = function (bridge) {
    throw new Error("LittleBitsBridge.discovered not implemented");
};

LittleBitsBridge.prototype.pulled = function (pulld) {
    throw new Error("LittleBitsBridge.pulled not implemented");
};

/*
 *  API
 */
exports.Bridge = LittleBitsBridge;
