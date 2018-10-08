AMQP channel queues - AMQPlib wrapper
=====================================

AMQP integration library for most used queues

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