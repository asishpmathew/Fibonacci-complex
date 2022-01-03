const keys = require("./keys")
const redis = require("redis")

const redisClient = redis.createClient({
    host: keys.redisClient,
    port: keys.redisPort,
    retry_strategy: () => 1000
})

const sub = redisClient.duplicate()

function fib(index) {
    if(index < 2) return 1;
    return fib(index-1) + fib(index-2);
}

sub.on('messages', (channel, message) =>{
    redisClient.hset('value', message, fib(parseInt(message)))
})

sub.subscribe('insert')