import RpcChannelQueue from '../lib/RpcChannelQueue';
import {CorrelationIdFactory} from '../lib/CorrelationIdFactory';
import Connection from '../lib/Connection';

const con  = new Connection('amqp://localhost');
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