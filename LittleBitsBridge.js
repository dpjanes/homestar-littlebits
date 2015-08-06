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
 *  See {iotdb.bridge.Bridge#Bridge} for documentation.
 *  <p>
 *  @param {object|undefined} native
 *  only used for instances, should be 
 */
var LittleBitsBridge = function (initd, native) {
    var self = this;

    self.initd = _.defaults(initd, {
        access_token: null,
        id: null,
        name: null,
    });
    self.native = native;

    if (self.native) {
        self.connected = {};
    }
};

LittleBitsBridge.prototype = new iotdb.Bridge();

LittleBitsBridge.prototype.name = function () {
    return "LittleBitsBridge";
};

/* --- lifecycle --- */

/**
 *  See {iotdb.bridge.Bridge#discover} for documentation.
 */
LittleBitsBridge.prototype.discover = function () {
    var self = this;

    var api = self._api();
    if (!api) {
        logger.error({
            method: "discover",
        }, "LittleBits is not configured correctly");
        return;
    }

    api.devices(function (error, devices) {
        for (var di in devices) {
            var device = devices[di];
            if (self.initd.id && (device.id !== self.initd.id)) {
                continue;
            } else if (self.initd.name && (device.label !== self.initd.name)) {
                continue;
            }

            var native = api.defaults({
                device_id: device.id,
            });

            var initd = _.defaults({
                id: device.id,
                name: device.label,
            }, self.initd);

            self.discovered(new LittleBitsBridge(initd, native));
        }
    });
};

/**
 *  See {iotdb.bridge.Bridge#connect} for documentation.
 */
LittleBitsBridge.prototype.connect = function (connectd) {
    var self = this;
    if (!self.native) {
        return;
    }

    self._validate_connect(connectd);

    self.connectd = _.defaults(
        connectd, {
            subscribes: [],
        },
        self.connectd
    );

    self._setup_events();
};

LittleBitsBridge.prototype._setup_events = function () {
    var self = this;

    for (var si in self.connectd.subscribes) {
        self._setup_event(self.connectd.subscribes[si]);
    }
};

LittleBitsBridge.prototype._setup_event = function (subscribe_id) {
    var self = this;

    self.native.subscribe({
        subscriber_id: self.initd.id,
        publisher_id: self.initd.id,
        publisher_events: [
            "amplitude",
            "amplitude:delta:sustain",
            "amplitude:delta:ignite",
            "amplitude:delta:release",
            "amplitude:delta:nap",
            "amplitude:level:active",
            "amplitude:level:idle",
        ]
    }, function () {
        // console.log("HERE:EVENT.ACTIVE", arguments);
    });

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
 *  See {iotdb.bridge.Bridge#disconnect} for documentation.
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
 *  See {iotdb.bridge.Bridge#push} for documentation.
 */
LittleBitsBridge.prototype.push = function (pushd, done) {
    var self = this;
    if (!self.native) {
        done(new Error("not connected"));
        return;
    }

    self._validate_push(pushd);

    var paramd = {
        cookd: pushd,
        rawd: {},
    };
    self.connectd.data_out(paramd);

    logger.info({
        method: "push",
        unique_id: self.unique_id,
        cookd: paramd.cookd,
        rawd: paramd.rawd,
    }, "pushed");

    if (paramd.rawd.percent !== undefined) {
        self.native.output({
            percent: paramd.rawd.percent,
            duration_ms: -1,
        }, function () {
            done();
            // console.log("HERE:RESULT", arguments);
        });
    } else if (paramd.rawd.color) {
        /*
        
        self.native.light({
            color: "yellow",
            mode: "blink",
        }, function() {
        });
        */
    }

    /*
    if (pushed.mode) {
    }

    if (pushed.duration) {
    }

    if (pushed.percent) {
    }

    percent :: Float | >= 0, <= 100


    color :: String | "green" "yellow" "red" "blue" "purple" "white" "cyan" "clownbarf"
    mode :: String | "blink" "hold"
    duration_ms :: Integer | >= 0
    device_id :: String
    */
};

/**
 *  See {iotdb.bridge.Bridge#pull} for documentation.
 */
LittleBitsBridge.prototype.pull = function () {
    var self = this;
    if (!self.native) {
        return;
    }
};

/* --- state --- */

/**
 *  See {iotdb.bridge.Bridge#meta} for documentation.
 */
LittleBitsBridge.prototype.meta = function () {
    var self = this;
    if (!self.native) {
        return;
    }

    return {
        "iot:thing-id": _.id.thing_urn.unique("LittleBits", self.initd.id),
        "schema:name": self.initd.name || "LittleBits",
        "schema:manufacturer": "http://littlebits.cc/",
        "schema:model": "http://littlebits.cc/cloud",
    };
};

/**
 *  See {iotdb.bridge.Bridge#reachable} for documentation.
 */
LittleBitsBridge.prototype.reachable = function () {
    if (this.native === null) {
        return false;
    }

    return this.native.is_connected;
};

/**
 *  See {iotdb.bridge.Bridge#configure} for documentation.
 */
LittleBitsBridge.prototype.configure = function (app) {};

/* --- internals -- */
var __api;

LittleBitsBridge.prototype._api = function () {
    var self = this;

    /* special case */
    if (self.initd.access_token) {
        return littlebits.defaults({
            access_token: self.initd.access_token,
        });
    }

    /* normal case */
    if (!__api) {
        var access_token = iotdb.keystore().get("/bridges/LittleBitsBridge/account/access_token");
        if (!access_token) {
            logger.error({
                method: "_api",
                cause: "set /bridges/LittleBitsBridge/account/access_token",
            }, "LittleBits is not configured correctly");
            return;
        }

        __api = littlebits.defaults({
            access_token: access_token,
        });
    }

    return __api;
};

/*
 *  API
 */
exports.Bridge = LittleBitsBridge;
