import {CloudEvent} from "cloudevents";
import {ulid} from "ulid";


export class EventExample extends CloudEvent<{message: string}> {
    constructor() {
        super({
            id: ulid(),
            source: 'halome.com/cloudevents',
            type: 'com.halome.test.hello',
            data: {
                message: `hello message ${ulid()}`
            },
        });
    }
}