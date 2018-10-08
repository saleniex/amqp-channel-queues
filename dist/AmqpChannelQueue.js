"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class AmqpChannelQueue {
    constructor(connection, queueName) {
        this._connection = connection;
        this._queueName = queueName;
    }
    getOrCreateChannel() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._channel) {
                this._channel = yield this.createQueueChannel();
            }
            return this._channel;
        });
    }
    getOrCreateAnonymousExclusiveChannel() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._channel) {
                this._channel = yield this.createExclusiveAnonymousQueueChannel();
            }
            return this._channel;
        });
    }
    get queueName() {
        return this._queueName;
    }
    sendToQueue(message) {
        this.getOrCreateChannel()
            .then((channel) => {
            channel.sendToQueue(this.queueName, new Buffer(message.toString()));
        });
    }
    sendRpcToQueue(message, callback, correlationIdFactory) {
        const correlationId = correlationIdFactory.create();
        this.getOrCreateAnonymousExclusiveChannel()
            .then((channelQueue) => {
            channelQueue.channel.consume(channelQueue.queue.queue, (message) => {
                if (message.properties.correlationId !== correlationId) {
                    return;
                }
                callback(message.content.toString());
            });
            const messageProperties = {
                correlationId: correlationId,
                replyTo: channelQueue.queue.queue,
            };
            channelQueue.channel.sendToQueue(this.queueName, new Buffer(message.toString()), messageProperties);
        });
    }
    replyToMessage(originMessage, message) {
        this.getOrCreateChannel()
            .then((channel) => {
            channel.sendToQueue(originMessage.properties.replyTo, new Buffer(message.toString()), { correlationId: originMessage.properties.correlationId });
        });
    }
    consume(callback) {
        this.getOrCreateChannel()
            .then((channel) => {
            channel.consume(this.queueName, callback);
        });
    }
    ack(message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.getOrCreateChannel()
                .then((channel) => {
                channel.ack(message);
            });
        });
    }
    createQueueChannel() {
        return new Promise((resolve, reject) => {
            if (!this._connection) {
                return reject(`Error while creating channel for queue "${this._queueName}". Open connection first.`);
            }
            this._connection.createChannel((err, channel) => {
                if (err) {
                    return reject(`Error while creating channel for queue "${this._queueName}": ${err.hasOwnProperty('message') ? err.message : err}`);
                }
                channel.assertQueue(this._queueName, { durable: true });
                resolve(channel);
            });
        });
    }
    createExclusiveAnonymousQueueChannel() {
        return new Promise((resolve, reject) => {
            if (!this._connection) {
                return reject(`Error while creating channel for queue "${this._queueName}". Open connection first.`);
            }
            this._connection.createChannel((err, channel) => {
                if (err) {
                    return reject(`Error while creating channel for queue "${this._queueName}": ${err.hasOwnProperty('message') ? err.message : err}`);
                }
                channel.assertQueue('', { exclusive: true }, (queueAssertErr, queue) => {
                    if (queueAssertErr) {
                        return reject(queueAssertErr);
                    }
                    resolve({
                        channel: channel,
                        queue: queue,
                    });
                });
            });
        });
    }
}
exports.AmqpChannelQueue = AmqpChannelQueue;
//# sourceMappingURL=AmqpChannelQueue.js.map