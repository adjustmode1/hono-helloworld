import {ExternalEventsPubsub} from "../src";
import {ModuleRootOptions} from "../src";
import {EventExample} from "./event-example";

(async () => {
    const options: ModuleRootOptions = {
        enabled: true,
        transport: {
            type: 'KAFKA',
            options: {
                client: {
                    clientId: 'test',
                    brokers: ['10.10.10.15:9095'],
                },
                consumer: {
                    groupId: 'test-service-consumers',
                    retry: {
                        maxRetryTime: 10
                    }
                }
            }
        },
        pubsub: {
            source: {outgoingStreamId: 'test'},
            subscriptions: [],
            events: {},
        }
    }
    const eventPubsub = new ExternalEventsPubsub(options);

    await eventPubsub.onModuleInit();

    const event = new EventExample();

    await eventPubsub.publish(event);
})()