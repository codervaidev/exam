import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// set cache
export const setCache = async (key: string, value: any, ttl: number = 60) => {
  console.log("setting cache", key);
  await redis.set(key, JSON.stringify(value), { ex: ttl });
};

// get cache
export const getCache = async (key: string) => {
  console.log("getting cache", key);
  const value = await redis.get(key);
  return value;
};

// delete cache
export const deleteCache = async (key: string) => {
  await redis.del(key);
};

export default redis;
