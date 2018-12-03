import Connection from './Connection';

export default abstract class ChannelQueue {
    protected _connection: Connection;
    protected _queueName: string;
    protected _channel: any = null;

    protected constructor(connection: Connection, queueName: string) {
        this._connection = connection;
        this._queueName = queueName;
    }

    public ack(message: any): void {
        if ( ! this.hasChannel()) {
            throw new Error(`Cannot send ACK to channel. No channel is created.`);
        }
        this._channel.ack(message);
    }

    protected async assertQueue(): Promise<void> {
        if ( ! this.hasChannel()) {
            throw new Error(`Cannot assert queue '${this._queueName}'. No channel created.`);
        }
        await this._channel.assertQueue(this._queueName);
    }

    protected async createChannel(): Promise<void> {
        if ( ! this._connection) {
            throw new Error('Cannot create channel queue channel. No connection.');
        }
        this._channel = await this._connection.createChannel();
    }


    protected hasChannel(): boolean {
        return this._channel !== null;
    }
}