import AmqpChannelQueue from './AmqpChannelQueue';

export default class AmqpConnection {
    private readonly _endpoint: string;
    private _connection: any;

    constructor(endpoint: string) {
        this._endpoint = endpoint;
    }


    public connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const amqp = require('amqplib/callback_api');
            amqp.connect(this._endpoint, (err: any, conn: any) => {
                if (err) {
                    return reject();
                }
                this._connection = conn;
                resolve();
            });
        });
    }


    public createQueueChannel(queueName: String): AmqpChannelQueue {
        return new AmqpChannelQueue(this._connection, queueName);
    }
}