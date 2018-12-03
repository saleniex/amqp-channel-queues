"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
class ChannelQueue {
    constructor(connection, queueName) {
        this._channel = null;
        this._connection = connection;
        this._queueName = queueName;
    }
    ack(message) {
        if (!this.hasChannel()) {
            throw new Error(`Cannot send ACK to channel. No channel is created.`);
        }
        this._channel.ack(message);
    }
    assertQueue() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.hasChannel()) {
                throw new Error(`Cannot assert queue '${this._queueName}'. No channel created.`);
            }
            yield this._channel.assertQueue(this._queueName);
        });
    }
    createChannel() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._connection) {
                throw new Error('Cannot create channel queue channel. No connection.');
            }
            this._channel = yield this._connection.createChannel();
        });
    }
    hasChannel() {
        return this._channel !== null;
    }
}
exports.default = ChannelQueue;
//# sourceMappingURL=ChannelQueue.js.map