import * as Buffer from 'buffer';
import { CloudEvent, Kafka as KafkaCEBuilder, KafkaMessage } from 'cloudevents';
import { Admin, Consumer, EachMessagePayload, Kafka, Producer } from 'kafkajs';

import { MessageHandler, ModuleRootOptions } from '../types';
import stringifyKafkaMessageHeaders from '../utils/stringify-kafka-message-headers';
import { ClientProxy } from './client-proxy';
import {getLogger} from '@packages/common';
import {RuntimeException} from "../runtime-exception";
import {WinstonLogCreator} from "../utils/kafka-logger";

const DEFAULT_OPTIONS = {
  admin: {},
  topic: {},
  subscribe: {},
  run: {},
  producer: {},
  send: {},
};

export class ClientKafka
  extends ClientProxy
{
  private readonly logger = getLogger(ClientKafka.name);

  protected producer?: Producer;
  protected consumer?: Consumer;
  protected admin?: Admin;
  protected client?: Kafka;

  protected subscriptions: Map<string, MessageHandler<unknown>[]> = new Map<
    string,
    MessageHandler<unknown>[]
  >();

  protected readonly transport: ModuleRootOptions['transport'];

  constructor(private readonly options: ModuleRootOptions) {
    super();
    this.transport = {
      ...options.transport,
      options: { ...DEFAULT_OPTIONS, ...options.transport.options },
    };
  }

  async onModuleInit(): Promise<void> {
    if (!this.options.enabled) return;

    try {
      this.logger.verbose('init kafka client');
      await this.connect();
    } catch (e) {
      this.logger.error('.onApplicationBootstrap', {
        reason: (e as Error).message,
      });
      throw new RuntimeException('Could not setup pubsub client');
    }
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.#runConsumer();
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.options.enabled) return;

    try {
      await this.close();
    } catch (e) {
      this.logger.error('.onModuleDestroy', { reason: (e as Error).message });
    }
  }

  async connect(): Promise<ClientKafka> {
    const options = this.transport.options;

    this.client = new Kafka({
      ...options.client,
      logCreator: WinstonLogCreator,
    });
    this.producer = this.client.producer({
      ...options.producer,
    });
    this.consumer = this.client.consumer({
      ...options.consumer,
    });
    this.admin = this.client.admin(options.admin);

    await this.producer.connect();
    await this.consumer.connect();
    await this.admin.connect();

    return this;
  }

  async close(): Promise<void> {
    this.producer && (await this.producer.disconnect());
    this.consumer && (await this.consumer.disconnect());
    this.admin && (await this.admin.disconnect());
    this.producer = undefined;
    this.consumer = undefined;
    this.admin = undefined;
    this.client = undefined;
  }

  public async createTopics(topics: string[]): Promise<boolean> {
    if (!this.admin) return false;

    let existing: string[] = [];

    try {
      this.logger.verbose(`preparing topics: ${JSON.stringify(topics, null, 2)}`);
      const meta = await this.admin.fetchTopicMetadata({ topics });
      existing = meta.topics.map((m) => m.name);
    } catch (e) {
      this.logger.warn('no topics found');
    }

    const missing = topics
      .filter((t) => !existing.includes(t))
      .map((t) => ({ ...this.transport.options.topic, topic: t }));

    if (!missing.length) {
      return false;
    }

    this.logger.verbose('creating topics', missing);
    return this.admin.createTopics({
      topics: missing,
    });
  }

  public async subscribe<T>(
    topics: string[],
    handler: MessageHandler<T>,
  ): Promise<void> {
    try {
      this.logger.verbose('subscribing topics', topics);

      for (const topic of topics) {
        const handlers = this.subscriptions.get(topic) || [];
        handlers.push(handler as MessageHandler<unknown>);
        this.subscriptions.set(topic, handlers);
      }

      await this.consumer?.subscribe({
        ...this.transport.options.subscribe,
        topics,
      });
    } catch (e) {
      this.logger.warn((e as Error).message);
    }
  }

  async publish(topic: string, ce: CloudEvent<unknown>): Promise<void> {
    const message = KafkaCEBuilder.structured(ce) as Omit<
      KafkaMessage,
      'value'
    > & { value: string | Buffer | null };

    await this.producer?.send({
      ...this.transport.options.send,
      topic,
      messages: [message],
    });
  }

  /**
   * Run consumer and start consuming events
   * @private
   */
  async #runConsumer() {
    await this.consumer?.run(
      Object.assign(this.transport.options.run || {}, {
        eachMessage: async (payload: EachMessagePayload) => {
          // convert kafka message back to cloudevents
          const raw = {
            headers: stringifyKafkaMessageHeaders(payload.message?.headers),
            value: payload.message.value?.toString(),
            body: payload.message.value?.toString(),
          };
          const message = KafkaCEBuilder.toEvent(raw);
          const handlers = this.subscriptions.get(payload.topic);
          if (!handlers) {
            this.logger.warn('unknown topic');
            return;
          }
          try {
            handlers.map((handler) => handler(message));
          } catch (e) {
            this.logger.error((e as Error).message, (e as Error).stack);
            throw e;
          }
        },
      }),
    );
  }
}
