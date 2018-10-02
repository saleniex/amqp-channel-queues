import AmqpChannelQueue from './AmqpChannelQueue';
export default class AmqpConnection {
    private readonly _endpoint;
    private _connection;
    constructor(endpoint: string);
    connect(): Promise<void>;
    createQueueChannel(queueName: String): AmqpChannelQueue;
}
