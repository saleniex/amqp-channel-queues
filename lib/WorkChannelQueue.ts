import ChannelQueue from './ChannelQueue';
import Connection from './Connection';

export default class WorkChannelQueue extends ChannelQueue {
    constructor(connection: Connection, queueName: string) {
        super(connection, queueName);
    }


    public async send(message: string): Promise<void> {
        if ( ! this.hasChannel()) {
            await this.createChannel();
        }
        await this.assertQueue();
        const success = await this._channel.sendToQueue(this._queueName, new Buffer(message));
        if ( ! success) {
            throw new Error('Cannot send message to work queue. Write buffer is full.');
        }
    }
}