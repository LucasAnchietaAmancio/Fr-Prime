// utils/RedisCache.js
const Redis = require('ioredis');

class RedisCache {
    constructor() {
        this.redis = new Redis({
            port: process.env.REDIS_PORT || 6379,
            host: process.env.REDIS_HOST || '127.0.0.1',
        });
    }

    async get(key) {
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key, value, ttl = 3300) { 
        await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    }

    async delete(key) {
        await this.redis.del(key);
    }

    async acquireLock(lockKey, ttl = 60) {
        const result = await this.redis.set(lockKey, 'locked', 'EX', ttl, 'NX');
        if (result === 'OK') {
            return true;
        }
        return false;
    }

    async releaseLock(lockKey) {
        await this.redis.del(lockKey);
    }
}

module.exports = new RedisCache();