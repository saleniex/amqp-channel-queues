import {CorrelationIdFactory} from './CorrelationIdFactory';

export class AmqpChannelQueue {
    private readonly _connection: any;
    private readonly _queueName: String;
    private _channel: any;

    constructor(connection: any, queueName: String) {
        this._connection = connection;
        this._queueName = queueName;
    }

    public async getOrCreateChannel(): Promise<any> {
        if ( ! this._channel) {
            this._channel = await this.createQueueChannel();
        }

        return this._channel;
    }

    public async getOrCreateAnonymousExclusiveChannel(): Promise<any> {
        if ( ! this._channel) {
            this._channel = await this.createExclusiveAnonymousQueueChannel();
        }

        return this._channel;
    }

    get queueName(): String {
        return this._queueName;
    }

    public sendToQueue(message: String): void {
        this.getOrCreateChannel()
            .then((channel: any) => {
                channel.sendToQueue(this.queueName, new Buffer(message.toString()));
            });
    }


    public sendRpcToQueue(message: String, callback: any, correlationIdFactory: CorrelationIdFactory): void {
        const correlationId = correlationIdFactory.create();
        this.getOrCreateAnonymousExclusiveChannel()
            .then((channelQueue: any) => {
                channelQueue.channel.consume(channelQueue.queue.queue, (message: any) => {
                    if (message.properties.correlationId !== correlationId) {
                        return;
                    }
                    callback(message.content.toString());
                });
                const messageProperties = {
                    correlationId: correlationId,
                    replyTo: channelQueue.queue.queue,
                };
                channelQueue.channel.sendToQueue(
                    this.queueName,
                    new Buffer(message.toString()),
                    messageProperties);
            });
    }


    public replyToMessage(originMessage: any, message: String): void {
        this.getOrCreateChannel()
            .then((channel: any) => {
                channel.sendToQueue(
                    originMessage.properties.replyTo,
                    new Buffer(message.toString()),
                    { correlationId: originMessage.properties.correlationId });
            });
    }

    public consume(callback: any): void {
        this.getOrCreateChannel()
            .then((channel: any) => {
                channel.consume(this.queueName, callback);
            });
    }


    public async ack(message: any): Promise<void> {
        this.getOrCreateChannel()
            .then((channel: any) => {
                channel.ack(message);
            });
    }

    private createQueueChannel(): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            if ( ! this._connection) {
                return reject(`Error while creating channel for queue "${this._queueName}". Open connection first.`);
            }
            this._connection.createChannel((err: any, channel: any) => {
                if (err) {
                    return reject(`Error while creating channel for queue "${this._queueName}": ${err.hasOwnProperty('message') ? err.message : err}`);
                }
                channel.assertQueue(this._queueName, {durable: true});
                resolve(channel);
            });
        });
    }


    private createExclusiveAnonymousQueueChannel(): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            if ( ! this._connection) {
                return reject(`Error while creating channel for queue "${this._queueName}". Open connection first.`);
            }
            this._connection.createChannel((err: any, channel: any) => {
                if (err) {
                    return reject(`Error while creating channel for queue "${this._queueName}": ${err.hasOwnProperty('message') ? err.message : err}`);
                }
                channel.assertQueue('', {exclusive: true}, (queueAssertErr: any, queue: any) => {
                    if (queueAssertErr) {
                        return reject(queueAssertErr);
                    }
                    resolve({
                        channel: channel,
                        queue: queue,
                    });
                });
            });
        });
    }
}