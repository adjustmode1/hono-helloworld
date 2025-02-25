import Redis, { Cluster, ClusterNode, ClusterOptions } from "ioredis";
import { getLogger, getOrThrow } from "@packages/common";
import { setupConfiguration } from "@packages/common";

type RedisConfig = {
    nodes: ClusterNode[];
    options?: ClusterOptions;
};

const logger = getLogger("Redis Config Service");

setupConfiguration();

let cluster: Cluster | null = null;

export function createRedisService() {
    const redisConfig = getOrThrow<RedisConfig>('redis');
    if (cluster === null) {
        cluster = new Redis.Cluster(redisConfig.nodes, redisConfig.options);
        logger.info("Redis initialized")
    } else {
        logger.error("Cluster has been initialized")
    }
}

export function redisCluster(): Cluster {
    if (cluster === null) {
        throw new Error('RedisCluster is not initialized');
    }
    return cluster;
}