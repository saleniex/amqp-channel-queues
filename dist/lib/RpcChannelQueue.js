"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ChannelQueue_1 = require("./ChannelQueue");
class RpcChannelQueue extends ChannelQueue_1.default {
    constructor(connection, queueName, correlationIdFactory) {
        super(connection, queueName);
        this._requestCallbacks = {};
        this._correlationIdFactory = correlationIdFactory;
    }
    sendAndConsume(message, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (typeof callback !== 'function') {
                throw new Error(`Cannot consume RPC reply. Callback is not a function.`);
            }
            if (!this.hasChannel()) {
                yield this.createChannel();
            }
            const correlationId = this.createCorrelationId();
            this._requestCallbacks[correlationId] = callback;
            return this.send(message, correlationId);
        });
    }
    send(message, correlationId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.assertQueue();
            const messageProperties = {
                correlationId: correlationId,
                replyTo: this._replyQueueName,
            };
            const success = yield this._channel.sendToQueue(this._queueName, new Buffer(message), messageProperties);
            if (!success) {
                throw new Error('Cannot send message to RPC queue. Write buffer is full.');
            }
        });
    }
    consumeReplies() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.hasChannel()) {
                yield this.createChannel();
            }
            if (!this._replyQueueName) {
                yield this.assertReplyQueue();
            }
            this._channel.consume(this._replyQueueName, (message) => {
                const correlationId = message.properties.correlationId;
                if (!this._requestCallbacks.hasOwnProperty(correlationId)) {
                    throw new Error(`Error while consuming reply. Unknown correlation ID '${correlationId}'.`);
                }
                const callback = this._requestCallbacks[correlationId];
                callback(message);
                delete this._requestCallbacks[correlationId];
            });
        });
    }
    assertReplyQueue() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.hasChannel()) {
                throw new Error(`Cannot assert reply queue for ${this._queueName}. No channel created.`);
            }
            const result = yield this._channel.assertQueue(null, { exclusive: true });
            this._replyQueueName = result['queue'];
        });
    }
    createCorrelationId() {
        return this._correlationIdFactory.create().toString();
    }
}
exports.default = RpcChannelQueue;
//# sourceMappingURL=RpcChannelQueue.js.map