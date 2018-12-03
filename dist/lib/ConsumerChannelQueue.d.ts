import ChannelQueue from './ChannelQueue';
import Connection from './Connection';
export default class ConsumerChannelQueue extends ChannelQueue {
    constructor(connection: Connection, queueName: string);
    consume(callback: any): Promise<void>;
    replyToMessage(message: string, replyToMessage: any): Promise<void>;
}
