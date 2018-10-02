'use strict';
const channelQueue = require('./src/AmqpChannelQueue');
const conenciton = require('./src/AmqpConnection');
const correlationIdFactory = require('./src/CorrelationIdFactory');

const acq = {
    AmqpChannelQueue: channelQueue,
    AmqpConnection: conenciton,
    CorrelationIdFactory: correlationIdFactory,
};

module.exports = acq;
module.exports.default = acq;

