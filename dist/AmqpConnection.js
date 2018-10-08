"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AmqpChannelQueue_1 = require("./AmqpChannelQueue");
class AmqpConnection {
    constructor(endpoint) {
        this._endpoint = endpoint;
    }
    connect() {
        return new Promise((resolve, reject) => {
            const amqp = require('amqplib/callback_api');
            amqp.connect(this._endpoint, (err, conn) => {
                if (err) {
                    return reject();
                }
                this._connection = conn;
                resolve();
            });
        });
    }
    createQueueChannel(queueName) {
        return new AmqpChannelQueue_1.AmqpChannelQueue(this._connection, queueName);
    }
}
exports.AmqpConnection = AmqpConnection;
//# sourceMappingURL=AmqpConnection.js.map