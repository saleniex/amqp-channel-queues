import { AmqpChannelQueue } from './AmqpChannelQueue';
import { Connection } from 'amqplib';
export declare class AmqpConnection {
    private readonly _endpoint;
    private _connection;
    constructor(endpoint: string);
    connect(): Promise<Connection>;
    createQueueChannel(queueName: String): AmqpChannelQueue;
}
