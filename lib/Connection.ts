import {AmqpChannelQueue} from './AmqpChannelQueue';
import * as amqplib from 'amqplib';

export default class Connection {
    private readonly _endpoint: string;
    private _connection: any;

    constructor(endpoint: string) {
        this._endpoint = endpoint;
    }


    public createConnection(): Promise<any> {
        return new Promise<void>((resolve: any, reject: any) => {
            amqplib.connect(this._endpoint)
                .then((conn: any) => {
                    this._connection = conn;
                    return resolve(this._connection);
                })
                .catch((reason: any) => {
                    return reject(reason);
                });
        });

    }


    public connect(): Promise<any> {
        return this.createConnection();
    }


    public createQueueChannel(queueName: String): AmqpChannelQueue {
        return new AmqpChannelQueue(this._connection, queueName);
    }

    public close(): void {
        this._connection.close.bind(this._connection);
    }


    public async createChannel(): Promise<any> {
        return this._connection.createChannel();
    }
}