import ChannelQueue from './ChannelQueue';
import { CorrelationIdFactory } from './CorrelationIdFactory';
import Connection from './Connection';
export default class RpcChannelQueue extends ChannelQueue {
    protected _replyQueueName: string;
    private _correlationIdFactory;
    private _requestCallbacks;
    constructor(connection: Connection, queueName: string, correlationIdFactory: CorrelationIdFactory);
    sendAndConsume(message: string, callback: Function): Promise<void>;
    private send;
    consumeReplies(): Promise<void>;
    private assertReplyQueue;
    private createCorrelationId;
}
