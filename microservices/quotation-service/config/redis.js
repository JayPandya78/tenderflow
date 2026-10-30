const {connectRedis, createClient} = require("redis");
const dotenv = require('dotenv');

dotenv.config();

const client = createClient({
    url: process.env.REDIS_URI
});

const connectionRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
        console.log('Redis connected');
    }
};

module.exports = { client, connectionRedis };
