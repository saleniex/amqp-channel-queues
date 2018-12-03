"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AmqpChannelQueue_1 = require("./AmqpChannelQueue");
const amqplib = require("amqplib");
class Connection {
    constructor(endpoint) {
        this._endpoint = endpoint;
    }
    createConnection() {
        return new Promise((resolve, reject) => {
            amqplib.connect(this._endpoint)
                .then((conn) => {
                this._connection = conn;
                return resolve(this._connection);
            })
                .catch((reason) => {
                return reject(reason);
            });
        });
    }
    connect() {
        return this.createConnection();
    }
    createQueueChannel(queueName) {
        return new AmqpChannelQueue_1.AmqpChannelQueue(this._connection, queueName);
    }
    close() {
        this._connection.close.bind(this._connection);
    }
    createChannel() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this._connection.createChannel();
        });
    }
}
exports.default = Connection;
//# sourceMappingURL=Connection.js.map