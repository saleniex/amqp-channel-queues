import ChannelQueue from './ChannelQueue';
import {CorrelationIdFactory} from './CorrelationIdFactory';
import Connection from './Connection';

export default class RpcChannelQueue extends ChannelQueue {
    protected _replyQueueName: string;
    private _correlationIdFactory: CorrelationIdFactory;
    private _requestCallbacks: object = {};


    constructor(connection: Connection, queueName: string, correlationIdFactory: CorrelationIdFactory) {
        super(connection, queueName);
        this._correlationIdFactory = correlationIdFactory;
    }


    public async sendAndConsume(message: string, callback: Function): Promise<void> {
        if (typeof callback !== 'function') {
            throw new Error(`Cannot consume RPC reply. Callback is not a function.`);
        }
        if ( ! this.hasChannel()) {
            await this.createChannel();
        }
        const correlationId = this.createCorrelationId();
        this._requestCallbacks[correlationId] = callback;
        return this.send(message, correlationId);
    }


    private async send(message: string, correlationId: string): Promise<void> {
        await this.assertQueue();
        const messageProperties = {
            correlationId: correlationId,
            replyTo: this._replyQueueName,
        };
        const success = await this._channel.sendToQueue(this._queueName, new Buffer(message), messageProperties);
        if ( ! success) {
            throw new Error('Cannot send message to RPC queue. Write buffer is full.');
        }
    }


    public async consumeReplies(): Promise<void> {
        if ( ! this.hasChannel()) {
            await this.createChannel();
        }
        if ( ! this._replyQueueName) {
            await this.assertReplyQueue();
        }
        this._channel.consume(this._replyQueueName, (message: any) => {
            const correlationId = message.properties.correlationId;
            if ( ! this._requestCallbacks.hasOwnProperty(correlationId)) {
                throw new Error(`Error while consuming reply. Unknown correlation ID '${correlationId}'.`);
            }
            const callback = this._requestCallbacks[correlationId];
            callback(message);
            delete this._requestCallbacks[correlationId];
        });
    }


    private async assertReplyQueue(): Promise<void> {
        if ( ! this.hasChannel()) {
            throw new Error(`Cannot assert reply queue for ${this._queueName}. No channel created.`);
        }
        const result = await this._channel.assertQueue(null, {exclusive: true});
        this._replyQueueName = result['queue'];
    }

    private createCorrelationId(): string {
        return this._correlationIdFactory.create().toString();
    }
}