import { CloudEvent } from 'cloudevents';
import { ulid } from 'ulid';

import { sanitizeProps } from './utils/sanitize-props';

export abstract class BaseEvent<Data> extends CloudEvent<Data> {
  protected constructor(props: Partial<BaseEvent<Data>>) {
    const sanitized = sanitizeProps(props);

    // source will be overridden by publisher later
    super({
      id: ulid(),
      excludeuserids: [],
      source: 'halome.com/cloudevents',
      ...sanitized,
      version: '2.0',
    });
  }
}
