# homestar-littlebits
[IOTDB](https://github.com/dpjanes/node-iotdb) Bridge for for [littleBits CloudBit](https://littlebits.cc/bits/cloudbit)

<img src="https://raw.githubusercontent.com/dpjanes/iotdb-homestar/master/docs/HomeStar.png" align="right" />

# About

NOTE: This is not working yet!!!

* http://control.littlebitscloud.cc/
* https://github.com/littlebits/cloud-client-api-http
* http://littlebits.cc/cloud

* [Read about Bridges](https://github.com/dpjanes/node-iotdb/blob/master/docs/bridges.md)

# Installation and Configuration

* [Read this first](https://github.com/dpjanes/node-iotdb/blob/master/docs/install.md)
* [Read about installing Home☆Star](https://github.com/dpjanes/node-iotdb/blob/master/docs/homestar.md) 

Then:

    $ npm install -g homestar    ## may require sudo
    $ homestar setup
    $ npm install homestar-littlebits

You'll also need an access token, which you can get from littleBits.

    homestar set /bridges/LittleBitsBridge/account/access\_token "your access token"


