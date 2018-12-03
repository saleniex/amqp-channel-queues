"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ChannelQueue_1 = require("./ChannelQueue");
class ConsumerChannelQueue extends ChannelQueue_1.default {
    constructor(connection, queueName) {
        super(connection, queueName);
    }
    consume(callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.hasChannel()) {
                yield this.createChannel();
            }
            yield this.assertQueue();
            this._channel.consume(this._queueName, callback);
        });
    }
    replyToMessage(message, replyToMessage) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const success = this._channel.sendToQueue(replyToMessage.properties.replyTo, new Buffer(message), { correlationId: replyToMessage.properties.correlationId });
            if (!success) {
                throw new Error(`Cannot reply to message in queue '${this._queueName}'.`);
            }
        });
    }
}
exports.default = ConsumerChannelQueue;
//# sourceMappingURL=ConsumerChannelQueue.js.map