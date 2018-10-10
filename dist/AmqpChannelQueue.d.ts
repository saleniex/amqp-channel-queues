import { CorrelationIdFactory } from './CorrelationIdFactory';
export declare class AmqpChannelQueue {
    private readonly _connection;
    private readonly _queueName;
    private _channel;
    constructor(connection: any, queueName: String);
    getOrCreateChannel(): Promise<any>;
    getOrCreateAnonymousExclusiveChannel(): Promise<any>;
    readonly queueName: String;
    sendToQueue(message: String): void;
    sendRpcToQueue(message: String, callback: any, correlationIdFactory: CorrelationIdFactory): void;
    replyToMessage(originMessage: any, message: String): void;
    consume(callback: any): void;
    ack(message: any): Promise<void>;
    private createQueueChannel;
    private createExclusiveAnonymousQueueChannel;
    channelPrefetch(i: number): void;
}
