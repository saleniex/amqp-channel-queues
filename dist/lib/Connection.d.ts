import { AmqpChannelQueue } from './AmqpChannelQueue';
export default class Connection {
    private readonly _endpoint;
    private _connection;
    constructor(endpoint: string);
    createConnection(): Promise<any>;
    connect(): Promise<any>;
    createQueueChannel(queueName: String): AmqpChannelQueue;
    close(): void;
    createChannel(): Promise<any>;
}
