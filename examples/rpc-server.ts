import ConsumerChannelQueue from '../lib/ConsumerChannelQueue';
import {AmqpConnection} from '../lib/AmqpConnection';

const con  = new AmqpConnection('amqp://localhost');
con.connect()
    .then(() => {
        const consumeQueue = new ConsumerChannelQueue(con, 'test.rpc');
        consumeQueue.consume((message: any) => {
            const msg = message.content.toString();
            console.log(`Message consumed: ${msg}. Reply with: 'Pong.${msg}'.`);
            consumeQueue.replyToMessage(`Pong.${msg}`, message)
                .then(() => {
                    consumeQueue.ack(message);
                });
        }). then(() => { console.log('Consumer is ready.') });
    });
