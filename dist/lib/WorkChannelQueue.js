"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ChannelQueue_1 = require("./ChannelQueue");
class WorkChannelQueue extends ChannelQueue_1.default {
    constructor(connection, queueName) {
        super(connection, queueName);
    }
    send(message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.hasChannel()) {
                yield this.createChannel();
            }
            yield this.assertQueue();
            const success = yield this._channel.sendToQueue(this._queueName, new Buffer(message));
            if (!success) {
                throw new Error('Cannot send message to work queue. Write buffer is full.');
            }
        });
    }
}
exports.default = WorkChannelQueue;
//# sourceMappingURL=WorkChannelQueue.js.map