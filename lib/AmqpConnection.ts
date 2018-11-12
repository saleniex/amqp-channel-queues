import {AmqpChannelQueue} from './AmqpChannelQueue';
import {Connection} from 'amqplib';

export class AmqpConnection {
    private readonly _endpoint: string;
    private _connection: any;

    constructor(endpoint: string) {
        this._endpoint = endpoint;
    }


    public connect(): Promise<Connection> {
        return new Promise<Connection>((resolve: any, reject: any) => {
            const amqp = require('amqplib/callback_api');
            amqp.connect(this._endpoint, (err: any, conn: any) => {
                if (err) {
                    return reject(err);
                }
                this._connection = conn;
                resolve(conn);
            });
        });
    }


    public createQueueChannel(queueName: String): AmqpChannelQueue {
        return new AmqpChannelQueue(this._connection, queueName);
    }
}