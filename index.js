'use strict';

var channelQueue = require('./dist/AmqpChannelQueue');
var conenciton = require('./dist/AmqpConnection');
var correlationIdFactory = require('./dist/CorrelationIdFactory');

var acq = {
    AmqpChannelQueue: channelQueue,
    AmqpConnection: conenciton,
    CorrelationIdFactory: correlationIdFactory,
};

module.exports = acq;
module.exports.default = acq;

