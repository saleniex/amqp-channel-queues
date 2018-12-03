import Connection from './Connection';
export default abstract class ChannelQueue {
    protected _connection: Connection;
    protected _queueName: string;
    protected _channel: any;
    protected constructor(connection: Connection, queueName: string);
    ack(message: any): void;
    protected assertQueue(): Promise<void>;
    protected createChannel(): Promise<void>;
    protected hasChannel(): boolean;
}
