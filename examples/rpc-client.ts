import {AmqpConnection} from '../lib/AmqpConnection';
import RpcChannelQueue from '../lib/RpcChannelQueue';
import {CorrelationIdFactory} from '../lib/CorrelationIdFactory';

const con  = new AmqpConnection('amqp://localhost');
con.connect()
    .then(() => {
        const rpcQueue = new RpcChannelQueue(con, 'test.rpc', new CorrelationIdFactory());
        rpcQueue.consumeReplies()
            .then(() => {
                let i = 1000;
                setInterval(() => {
                    const callIdx = i++;
                    rpcQueue.sendAndConsume(`Ping.${callIdx}`, (message: any) => {
                        console.log(`Response for (${callIdx}): ${message.content.toString()}`);
                        rpcQueue.ack(message);
                    }).then(() => {console.log(`RPC request sent for ${callIdx}`)});
                }, 10);
            });
    });