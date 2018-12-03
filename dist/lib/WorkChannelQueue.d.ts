import ChannelQueue from './ChannelQueue';
import Connection from './Connection';
export default class WorkChannelQueue extends ChannelQueue {
    constructor(connection: Connection, queueName: string);
    send(message: string): Promise<void>;
}
