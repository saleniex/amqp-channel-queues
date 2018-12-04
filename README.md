AMQP channel queues - AMQPlib wrapper
=====================================

AMQP integration library for most used queues

### RPC
**Server**
```javascript 1.8
import {Connection, ConsumerChannelQueue} from 'amqp-channel-queues';

const con  = new Connection('amqp://localhost');
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
```

**Client**

```javascript 1.8
import {Connection, RpcChannelQueue, CorrelationIdFactory} from 'amqp-channel-queues';

const con  = new Connection('amqp://localhost');
con.connect()
    .then(() => {
        const rpcQueue = new RpcChannelQueue(con, 'test.rpc', new CorrelationIdFactory());
        rpcQueue.consumeReplies()
            .then(() => {
                rpcQueue.sendAndConsume(`Ping`, (message: any) => {
                    console.log(`Response: ${message.content.toString()}`);
                    rpcQueue.ack(message);
                }).then(() => {console.log(`RPC request sent.`)});
            });
    });
```

## Legacy approach

### Work queue
```
import {AmqpConnection} from 'amqp-channel-queues';

const amqpConnection = new AmqpConnection('amqp://localhost');
amqpConnection.connect()
    .then(async () => {
        const workQueueChannel = amqpConnection.createQueueChannel('work-queue');
        workQueueChannel.consume(async (message: any) => {
            const messageContent = message.content.toString();
            
            // Do some work...       
             
            return workQueueChannel.ack(message);
        });    
    })
    .catch(() => { console.log('Error while connecting')});
```

### Remote Procedure Call (RPC)
```
import {AmqpConnection} from 'amqp-channel-queues';

const amqpConnection = new AmqpConnection('amqp://localhost');
amqpConnection.connect()
    .then(async () => {
        const rpcChannel = amqpConnection.createQueueChannel('rpc-queue');
        rpcChannel.consume(async (message: any) => {
        
            // Prepare response ...
            
            rpcChannel.replyToMessage(message, 'PREPARED RESPONSE HERE');
            return rpcChannel.ack(message);
        });
    })
    .catch(() => { console.log('Error while connecting')});
```