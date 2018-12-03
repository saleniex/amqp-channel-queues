import ChannelQueue from './ChannelQueue';
import Connection from './Connection';

export default class ConsumerChannelQueue extends ChannelQueue {


    constructor(connection: Connection, queueName: string) {
        super(connection, queueName);
    }

    public async consume(callback: any): Promise<void> {
        if ( ! this.hasChannel()) {
            await this.createChannel();
        }
        await this.assertQueue();
        this._channel.consume(this._queueName, callback);
    }

    public async replyToMessage(message: string, replyToMessage: any): Promise<void> {
        const success = this._channel.sendToQueue(
            replyToMessage.properties.replyTo,
            new Buffer(message),
            { correlationId: replyToMessage.properties.correlationId });
        if ( ! success) {
            throw new Error(`Cannot reply to message in queue '${this._queueName}'.`);
        }
    }

}